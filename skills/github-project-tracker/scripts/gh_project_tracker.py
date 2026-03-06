#!/usr/bin/env python3
"""GitHub Project v2 issue and feature/bug tracking utilities."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from dataclasses import dataclass
from typing import Any, Dict, Iterable, List, Optional
from urllib.parse import quote

BUG_LABELS = {"bug", "type:bug", "kind/bug", "defect"}
FEATURE_LABELS = {"enhancement", "feature", "type:feature", "kind/feature"}
DEFAULT_STATUS_FIELD = "Status"


class GitHubCliError(RuntimeError):
    """Raised when a GitHub CLI command fails."""


@dataclass
class ProjectField:
    id: str
    name: str
    data_type: str
    options: Dict[str, str]


@dataclass
class ProjectInfo:
    id: str
    owner: str
    number: int
    title: str
    url: str
    fields_by_name: Dict[str, ProjectField]


class GhClient:
    def run(
        self,
        args: List[str],
        *,
        input_text: Optional[str] = None,
        expect_json: bool = False,
    ) -> Any:
        command = ["gh", *args]
        proc = subprocess.run(
            command,
            text=True,
            input=input_text,
            capture_output=True,
        )
        if proc.returncode != 0:
            error_text = proc.stderr.strip() or proc.stdout.strip() or "Unknown gh error"
            raise GitHubCliError(f"gh command failed: {' '.join(command)}\n{error_text}")

        output = proc.stdout.strip()
        if expect_json:
            if not output:
                return None
            try:
                return json.loads(output)
            except json.JSONDecodeError as exc:
                raise GitHubCliError(f"Failed to parse JSON output: {exc}") from exc
        return output

    def api(
        self,
        endpoint: str,
        *,
        method: str = "GET",
        body: Optional[Dict[str, Any]] = None,
        expect_json: bool = True,
    ) -> Any:
        args = ["api", endpoint]
        if method.upper() != "GET":
            args.extend(["-X", method.upper()])

        input_text = None
        if body is not None:
            args.extend(["--input", "-"])
            input_text = json.dumps(body)

        return self.run(args, input_text=input_text, expect_json=expect_json)

    def graphql(self, query: str, variables: Dict[str, Any]) -> Dict[str, Any]:
        payload = {"query": query, "variables": variables}
        response = self.run(
            ["api", "graphql", "--input", "-"],
            input_text=json.dumps(payload),
            expect_json=True,
        )
        if response is None:
            raise GitHubCliError("Empty GraphQL response")
        if "errors" in response and response["errors"]:
            raise GitHubCliError(f"GraphQL error: {response['errors']}")
        return response


PROJECT_QUERY = """
query($owner: String!, $number: Int!) {
  user(login: $owner) {
    projectV2(number: $number) {
      id
      title
      url
      fields(first: 100) {
        nodes {
          ... on ProjectV2FieldCommon {
            id
            name
            dataType
          }
          ... on ProjectV2SingleSelectField {
            options {
              id
              name
            }
          }
        }
      }
    }
  }
  organization(login: $owner) {
    projectV2(number: $number) {
      id
      title
      url
      fields(first: 100) {
        nodes {
          ... on ProjectV2FieldCommon {
            id
            name
            dataType
          }
          ... on ProjectV2SingleSelectField {
            options {
              id
              name
            }
          }
        }
      }
    }
  }
}
"""

PROJECT_ITEMS_QUERY = """
query($projectId: ID!, $after: String) {
  node(id: $projectId) {
    ... on ProjectV2 {
      items(first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          fieldValues(first: 50) {
            nodes {
              ... on ProjectV2ItemFieldSingleSelectValue {
                name
                optionId
                field {
                  ... on ProjectV2FieldCommon {
                    id
                    name
                  }
                }
              }
              ... on ProjectV2ItemFieldTextValue {
                text
                field {
                  ... on ProjectV2FieldCommon {
                    id
                    name
                  }
                }
              }
              ... on ProjectV2ItemFieldNumberValue {
                number
                field {
                  ... on ProjectV2FieldCommon {
                    id
                    name
                  }
                }
              }
              ... on ProjectV2ItemFieldDateValue {
                date
                field {
                  ... on ProjectV2FieldCommon {
                    id
                    name
                  }
                }
              }
              ... on ProjectV2ItemFieldIterationValue {
                title
                iterationId
                field {
                  ... on ProjectV2FieldCommon {
                    id
                    name
                  }
                }
              }
            }
          }
          content {
            __typename
            ... on Issue {
              id
              number
              title
              url
              state
              repository {
                name
                owner {
                  login
                }
              }
              labels(first: 30) {
                nodes {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
}
"""

PROJECT_ITEM_LINK_QUERY = """
query($projectId: ID!, $after: String) {
  node(id: $projectId) {
    ... on ProjectV2 {
      items(first: 100, after: $after) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          content {
            __typename
            ... on Issue {
              id
            }
          }
        }
      }
    }
  }
}
"""

ADD_ITEM_MUTATION = """
mutation($projectId: ID!, $contentId: ID!) {
  addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
    item {
      id
    }
  }
}
"""

UPDATE_SINGLE_SELECT_MUTATION = """
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $optionId: String!) {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: {singleSelectOptionId: $optionId}
    }
  ) {
    projectV2Item {
      id
    }
  }
}
"""

UPDATE_TEXT_MUTATION = """
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $text: String!) {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: {text: $text}
    }
  ) {
    projectV2Item {
      id
    }
  }
}
"""

UPDATE_NUMBER_MUTATION = """
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $number: Float!) {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: {number: $number}
    }
  ) {
    projectV2Item {
      id
    }
  }
}
"""

UPDATE_DATE_MUTATION = """
mutation($projectId: ID!, $itemId: ID!, $fieldId: ID!, $date: Date!) {
  updateProjectV2ItemFieldValue(
    input: {
      projectId: $projectId
      itemId: $itemId
      fieldId: $fieldId
      value: {date: $date}
    }
  ) {
    projectV2Item {
      id
    }
  }
}
"""


def normalize_label(name: str) -> str:
    return name.strip().lower()


def parse_name_value_pairs(raw_pairs: List[str]) -> Dict[str, str]:
    values: Dict[str, str] = {}
    for pair in raw_pairs:
        if "=" not in pair:
            raise ValueError(f"Invalid --field value '{pair}'. Expected NAME=VALUE.")
        field_name, field_value = pair.split("=", 1)
        key = field_name.strip()
        if not key:
            raise ValueError(f"Invalid --field value '{pair}'. Field name is empty.")
        values[key] = field_value.strip()
    return values


def parse_types(raw_types: str) -> List[str]:
    types = [entry.strip().lower() for entry in raw_types.split(",") if entry.strip()]
    if not types:
        return ["bug", "feature"]
    valid = {"bug", "feature", "other", "all"}
    unknown = [entry for entry in types if entry not in valid]
    if unknown:
        raise ValueError(f"Unsupported type filters: {', '.join(sorted(set(unknown)))}")
    if "all" in types:
        return ["bug", "feature", "other"]
    return list(dict.fromkeys(types))


def classify_issue_type(labels: Iterable[str]) -> str:
    normalized = {normalize_label(label) for label in labels}
    if normalized & BUG_LABELS:
        return "bug"
    if normalized & FEATURE_LABELS:
        return "feature"
    return "other"


def collect_field_values(item_node: Dict[str, Any]) -> Dict[str, Any]:
    values: Dict[str, Any] = {}
    for value_node in item_node.get("fieldValues", {}).get("nodes", []):
        field_name = (value_node.get("field") or {}).get("name")
        if not field_name:
            continue
        if "name" in value_node and value_node.get("name") is not None:
            values[field_name] = value_node["name"]
        elif "text" in value_node and value_node.get("text") is not None:
            values[field_name] = value_node["text"]
        elif "number" in value_node and value_node.get("number") is not None:
            values[field_name] = value_node["number"]
        elif "date" in value_node and value_node.get("date") is not None:
            values[field_name] = value_node["date"]
        elif "title" in value_node and value_node.get("title") is not None:
            values[field_name] = value_node["title"]
    return values


def resolve_project(client: GhClient, owner: str, number: int) -> ProjectInfo:
    response = client.graphql(PROJECT_QUERY, {"owner": owner, "number": number})
    data = response.get("data", {})
    project = (data.get("user") or {}).get("projectV2")
    if project is None:
        project = (data.get("organization") or {}).get("projectV2")

    if project is None:
        raise GitHubCliError(
            f"Could not resolve Project v2 {owner}/{number}. "
            "Check owner, number, and gh auth scopes."
        )

    fields_by_name: Dict[str, ProjectField] = {}
    for node in project.get("fields", {}).get("nodes", []):
        field_id = node.get("id")
        field_name = node.get("name")
        field_type = node.get("dataType")
        if not field_id or not field_name or not field_type:
            continue
        options = {
            opt.get("name", "").strip().lower(): opt.get("id", "")
            for opt in node.get("options", [])
            if opt.get("name") and opt.get("id")
        }
        fields_by_name[field_name.lower()] = ProjectField(
            id=field_id,
            name=field_name,
            data_type=field_type,
            options=options,
        )

    return ProjectInfo(
        id=project["id"],
        owner=owner,
        number=number,
        title=project.get("title", ""),
        url=project.get("url", ""),
        fields_by_name=fields_by_name,
    )


def list_project_items(client: GhClient, project_id: str) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    after: Optional[str] = None

    while True:
        response = client.graphql(PROJECT_ITEMS_QUERY, {"projectId": project_id, "after": after})
        node = response.get("data", {}).get("node") or {}
        page = node.get("items") or {}
        nodes = page.get("nodes") or []
        for item in nodes:
            content = item.get("content") or {}
            if content.get("__typename") != "Issue":
                continue
            labels = [label.get("name", "") for label in content.get("labels", {}).get("nodes", [])]
            issue_type = classify_issue_type(labels)
            field_values = collect_field_values(item)
            items.append(
                {
                    "item_id": item.get("id"),
                    "issue_id": content.get("id"),
                    "issue_number": content.get("number"),
                    "title": content.get("title"),
                    "url": content.get("url"),
                    "state": content.get("state", "").lower(),
                    "repo": f"{content.get('repository', {}).get('owner', {}).get('login', '')}/"
                    f"{content.get('repository', {}).get('name', '')}",
                    "labels": [label for label in labels if label],
                    "type": issue_type,
                    "fields": field_values,
                }
            )

        page_info = page.get("pageInfo") or {}
        if not page_info.get("hasNextPage"):
            break
        after = page_info.get("endCursor")

    return items


def find_project_item_id(client: GhClient, project_id: str, issue_node_id: str) -> Optional[str]:
    after: Optional[str] = None

    while True:
        response = client.graphql(PROJECT_ITEM_LINK_QUERY, {"projectId": project_id, "after": after})
        node = response.get("data", {}).get("node") or {}
        page = node.get("items") or {}
        for item in page.get("nodes", []):
            content = item.get("content") or {}
            if content.get("__typename") == "Issue" and content.get("id") == issue_node_id:
                return item.get("id")

        page_info = page.get("pageInfo") or {}
        if not page_info.get("hasNextPage"):
            return None
        after = page_info.get("endCursor")


def ensure_project_item(client: GhClient, project_id: str, issue_node_id: str) -> str:
    existing = find_project_item_id(client, project_id, issue_node_id)
    if existing:
        return existing

    response = client.graphql(
        ADD_ITEM_MUTATION,
        {"projectId": project_id, "contentId": issue_node_id},
    )
    item_id = (
        response.get("data", {})
        .get("addProjectV2ItemById", {})
        .get("item", {})
        .get("id")
    )
    if not item_id:
        raise GitHubCliError("Failed to add issue to project")
    return item_id


def set_project_field_value(
    client: GhClient,
    project: ProjectInfo,
    item_id: str,
    field_name: str,
    value: str,
) -> None:
    field = project.fields_by_name.get(field_name.lower())
    if field is None:
        available = ", ".join(sorted(pf.name for pf in project.fields_by_name.values()))
        raise GitHubCliError(
            f"Project field '{field_name}' was not found. Available fields: {available}"
        )

    variables: Dict[str, Any] = {
        "projectId": project.id,
        "itemId": item_id,
        "fieldId": field.id,
    }

    if field.data_type == "SINGLE_SELECT":
        option_id = field.options.get(value.strip().lower())
        if not option_id:
            options = ", ".join(sorted(option for option in field.options.keys()))
            raise GitHubCliError(
                f"Value '{value}' is not valid for field '{field.name}'. "
                f"Available options: {options}"
            )
        variables["optionId"] = option_id
        client.graphql(UPDATE_SINGLE_SELECT_MUTATION, variables)
        return

    if field.data_type == "TEXT":
        variables["text"] = value
        client.graphql(UPDATE_TEXT_MUTATION, variables)
        return

    if field.data_type == "NUMBER":
        try:
            variables["number"] = float(value)
        except ValueError as exc:
            raise GitHubCliError(
                f"Field '{field.name}' expects a number. Received '{value}'."
            ) from exc
        client.graphql(UPDATE_NUMBER_MUTATION, variables)
        return

    if field.data_type == "DATE":
        variables["date"] = value
        client.graphql(UPDATE_DATE_MUTATION, variables)
        return

    raise GitHubCliError(
        f"Field '{field.name}' has unsupported type '{field.data_type}'. "
        "Supported types: SINGLE_SELECT, TEXT, NUMBER, DATE."
    )


def map_type_to_label(issue_type: Optional[str]) -> Optional[str]:
    if issue_type == "bug":
        return "bug"
    if issue_type == "feature":
        return "enhancement"
    return None


def print_json(data: Any) -> None:
    print(json.dumps(data, indent=2, sort_keys=True))


def print_overview_table(items: List[Dict[str, Any]], status_field: str) -> None:
    if not items:
        print("No matching issues were found in the project.")
        return

    headers = ["Issue", "Type", "State", status_field, "Title"]
    rows: List[List[str]] = []
    for item in items:
        status_value = str(item.get("fields", {}).get(status_field, ""))
        rows.append(
            [
                f"{item['repo']}#{item['issue_number']}",
                item["type"],
                item["state"],
                status_value,
                item["title"],
            ]
        )

    widths = [len(header) for header in headers]
    for row in rows:
        for index, cell in enumerate(row):
            widths[index] = max(widths[index], len(cell))

    def format_row(cells: List[str]) -> str:
        return " | ".join(cell.ljust(widths[i]) for i, cell in enumerate(cells))

    print(format_row(headers))
    print("-+-".join("-" * width for width in widths))
    for row in rows:
        print(format_row(row))


def cmd_overview(client: GhClient, args: argparse.Namespace) -> int:
    project = resolve_project(client, args.owner, args.project_number)
    items = list_project_items(client, project.id)

    wanted_types = parse_types(args.types)
    filtered = [item for item in items if item["type"] in wanted_types]
    if args.state != "all":
        filtered = [item for item in filtered if item["state"] == args.state]

    if args.limit:
        filtered = filtered[: args.limit]

    bug_count = sum(1 for item in filtered if item["type"] == "bug")
    feature_count = sum(1 for item in filtered if item["type"] == "feature")
    other_count = sum(1 for item in filtered if item["type"] == "other")

    output = {
        "project": {
            "owner": project.owner,
            "number": project.number,
            "title": project.title,
            "url": project.url,
        },
        "filters": {
            "types": wanted_types,
            "state": args.state,
            "limit": args.limit,
        },
        "counts": {
            "total": len(filtered),
            "bug": bug_count,
            "feature": feature_count,
            "other": other_count,
        },
        "items": filtered,
    }

    if args.json:
        print_json(output)
    else:
        print(f"Project: {project.title} ({project.owner}/{project.number})")
        print(f"URL: {project.url}")
        print(
            "Counts: "
            f"total={output['counts']['total']} "
            f"bug={bug_count} feature={feature_count} other={other_count}"
        )
        print_overview_table(filtered, args.status_field)

    return 0


def apply_issue_edits(
    client: GhClient,
    repo: str,
    issue_number: int,
    *,
    title: Optional[str],
    body: Optional[str],
    state: Optional[str],
    add_labels: List[str],
    remove_labels: List[str],
) -> Dict[str, Any]:
    issue = client.api(f"repos/{repo}/issues/{issue_number}")
    if issue is None:
        raise GitHubCliError(f"Issue {repo}#{issue_number} was not found")

    issue_url = issue.get("html_url")
    issue_node_id = issue.get("node_id")
    if not issue_node_id:
        raise GitHubCliError(f"Issue {repo}#{issue_number} is missing node_id")

    patch_body: Dict[str, Any] = {}
    if title is not None:
        patch_body["title"] = title
    if body is not None:
        patch_body["body"] = body
    if state is not None:
        patch_body["state"] = state

    if patch_body:
        client.api(
            f"repos/{repo}/issues/{issue_number}",
            method="PATCH",
            body=patch_body,
            expect_json=True,
        )

    if add_labels:
        client.api(
            f"repos/{repo}/issues/{issue_number}/labels",
            method="POST",
            body={"labels": add_labels},
            expect_json=True,
        )

    for label in remove_labels:
        label_segment = quote(label, safe="")
        try:
            client.api(
                f"repos/{repo}/issues/{issue_number}/labels/{label_segment}",
                method="DELETE",
                expect_json=False,
            )
        except GitHubCliError:
            # Ignore labels that are not currently set.
            continue

    return {"url": issue_url, "node_id": issue_node_id}


def cmd_create_issue(client: GhClient, args: argparse.Namespace) -> int:
    labels = set(args.label or [])
    mapped_label = map_type_to_label(args.type)
    if mapped_label:
        labels.add(mapped_label)

    issue_body: Dict[str, Any] = {"title": args.title}
    if args.body:
        issue_body["body"] = args.body
    if labels:
        issue_body["labels"] = sorted(labels)

    extra_fields = parse_name_value_pairs(args.field or [])

    if args.dry_run:
        print("Dry run: create issue plan")
        print_json(
            {
                "repo": args.repo,
                "issue": issue_body,
                "project": {
                    "owner": args.project_owner,
                    "number": args.project_number,
                    "status": args.status,
                    "fields": extra_fields,
                }
                if args.project_owner and args.project_number
                else None,
            }
        )
        return 0

    issue = client.api(
        f"repos/{args.repo}/issues",
        method="POST",
        body=issue_body,
        expect_json=True,
    )
    issue_number = issue.get("number")
    issue_node_id = issue.get("node_id")
    issue_url = issue.get("html_url")

    if not issue_number or not issue_node_id:
        raise GitHubCliError("Issue creation did not return number/node_id")

    if args.project_owner and args.project_number:
        project = resolve_project(client, args.project_owner, args.project_number)
        item_id = ensure_project_item(client, project.id, issue_node_id)

        if args.status:
            set_project_field_value(client, project, item_id, args.status_field, args.status)

        for field_name, value in extra_fields.items():
            set_project_field_value(client, project, item_id, field_name, value)

    print_json(
        {
            "created_issue": f"{args.repo}#{issue_number}",
            "url": issue_url,
            "project_linked": bool(args.project_owner and args.project_number),
        }
    )
    return 0


def cmd_update_issue(client: GhClient, args: argparse.Namespace) -> int:
    add_labels = set(args.add_label or [])
    remove_labels = set(args.remove_label or [])

    mapped_label = map_type_to_label(args.type)
    if mapped_label:
        add_labels.add(mapped_label)
        if mapped_label == "bug":
            remove_labels.add("enhancement")
        if mapped_label == "enhancement":
            remove_labels.add("bug")

    extra_fields = parse_name_value_pairs(args.field or [])
    if args.dry_run:
        print("Dry run: issue update plan")
        print_json(
            {
                "repo": args.repo,
                "issue_number": args.issue_number,
                "patch": {
                    key: value
                    for key, value in {
                        "title": args.title,
                        "body": args.body,
                        "state": args.state,
                    }.items()
                    if value is not None
                },
                "add_labels": sorted(add_labels),
                "remove_labels": sorted(remove_labels),
            }
        )
        if args.project_owner and args.project_number:
            print("Dry run: project update plan")
            print_json(
                {
                    "project_owner": args.project_owner,
                    "project_number": args.project_number,
                    "status_field": args.status_field,
                    "status": args.status,
                    "fields": extra_fields,
                }
            )
        return 0

    issue_result = apply_issue_edits(
        client,
        args.repo,
        args.issue_number,
        title=args.title,
        body=args.body,
        state=args.state,
        add_labels=sorted(add_labels),
        remove_labels=sorted(remove_labels),
    )

    if args.project_owner and args.project_number:
        project = resolve_project(client, args.project_owner, args.project_number)
        item_id = ensure_project_item(client, project.id, issue_result["node_id"])

        if args.status:
            set_project_field_value(client, project, item_id, args.status_field, args.status)

        for field_name, value in extra_fields.items():
            set_project_field_value(client, project, item_id, field_name, value)

    print_json(
        {
            "updated_issue": f"{args.repo}#{args.issue_number}",
            "url": issue_result["url"],
            "project_updated": bool(args.project_owner and args.project_number),
        }
    )
    return 0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Track bug/feature issues in GitHub Project v2 and apply updates.",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    overview = subparsers.add_parser(
        "overview",
        help="List issue items in a Project v2 and classify them as bug/feature/other.",
    )
    overview.add_argument("--owner", required=True, help="User/org that owns the project")
    overview.add_argument("--project-number", required=True, type=int)
    overview.add_argument(
        "--types",
        default="bug,feature",
        help="Comma-separated type filter: bug,feature,other,all",
    )
    overview.add_argument(
        "--state",
        default="open",
        choices=["open", "closed", "all"],
        help="Issue state filter",
    )
    overview.add_argument(
        "--status-field",
        default=DEFAULT_STATUS_FIELD,
        help="Project field name to display as status",
    )
    overview.add_argument("--limit", type=int, default=0, help="Max rows (0 = all)")
    overview.add_argument("--json", action="store_true", help="Print JSON output")

    create = subparsers.add_parser(
        "create-issue",
        help="Create an issue and optionally link it to a project with field updates.",
    )
    create.add_argument("--repo", required=True, help="owner/repo")
    create.add_argument("--title", required=True)
    create.add_argument("--body", default="")
    create.add_argument("--type", choices=["bug", "feature"])
    create.add_argument("--label", action="append", default=[], help="Issue label (repeatable)")
    create.add_argument("--project-owner")
    create.add_argument("--project-number", type=int)
    create.add_argument(
        "--status-field",
        default=DEFAULT_STATUS_FIELD,
        help="Project single-select field name used for status updates",
    )
    create.add_argument("--status", help="Project status option name")
    create.add_argument(
        "--field",
        action="append",
        default=[],
        help="Project field update in NAME=VALUE form (repeatable)",
    )
    create.add_argument("--dry-run", action="store_true")

    update = subparsers.add_parser(
        "update-issue",
        help="Update issue metadata and optionally update project fields/status.",
    )
    update.add_argument("--repo", required=True, help="owner/repo")
    update.add_argument("--issue-number", required=True, type=int)
    update.add_argument("--title")
    update.add_argument("--body")
    update.add_argument("--state", choices=["open", "closed"])
    update.add_argument("--type", choices=["bug", "feature"])
    update.add_argument("--add-label", action="append", default=[])
    update.add_argument("--remove-label", action="append", default=[])
    update.add_argument("--project-owner")
    update.add_argument("--project-number", type=int)
    update.add_argument(
        "--status-field",
        default=DEFAULT_STATUS_FIELD,
        help="Project single-select field name used for status updates",
    )
    update.add_argument("--status", help="Project status option name")
    update.add_argument(
        "--field",
        action="append",
        default=[],
        help="Project field update in NAME=VALUE form (repeatable)",
    )
    update.add_argument("--dry-run", action="store_true")

    return parser


def validate_project_args(args: argparse.Namespace) -> None:
    has_owner = bool(getattr(args, "project_owner", None))
    has_number = getattr(args, "project_number", None) is not None
    if has_owner != has_number:
        raise ValueError("Provide both --project-owner and --project-number together.")


def main(argv: Optional[List[str]] = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    try:
        if args.command in {"create-issue", "update-issue"}:
            validate_project_args(args)

        client = GhClient()

        if args.command == "overview":
            return cmd_overview(client, args)
        if args.command == "create-issue":
            return cmd_create_issue(client, args)
        if args.command == "update-issue":
            return cmd_update_issue(client, args)

        raise ValueError(f"Unknown command: {args.command}")
    except (GitHubCliError, ValueError) as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
