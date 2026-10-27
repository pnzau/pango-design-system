import {
  Check,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  cx,
  useControllableState,
  useEscapeKey,
  useOutsidePointer,
  useStableId,
} from "../lib/utils";
import { InputField } from "./Primitives";

export type TreeNode = {
  id: string;
  label: ReactNode;
  children?: readonly TreeNode[];
  description?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
};

export type TreeSelectionMode = "single" | "multiple";

type TreeViewProps = {
  nodes: readonly TreeNode[];
  selectionMode?: TreeSelectionMode;
  selectedId?: string;
  defaultSelectedId?: string;
  selectedIds?: readonly string[];
  defaultSelectedIds?: readonly string[];
  onSelectionChange?: (selection: string | readonly string[]) => void;
  onSelect?: (node: TreeNode) => void;
  expandedIds?: readonly string[];
  defaultExpandedIds?: readonly string[];
  onExpandedChange?: (ids: readonly string[]) => void;
  label?: string;
  className?: string;
};

export function TreeView({
  nodes,
  selectionMode = "single",
  selectedId,
  defaultSelectedId = "",
  selectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  onSelect,
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  label = "Tree",
  className,
}: TreeViewProps) {
  const [internalSelectedId, setInternalSelectedId] =
    useState(defaultSelectedId);
  const [internalSelectedIds, setInternalSelectedIds] =
    useState<readonly string[]>(defaultSelectedIds);
  const [internalExpandedIds, setInternalExpandedIds] =
    useState<readonly string[]>(defaultExpandedIds);
  const activeSelectedId = selectedId ?? internalSelectedId;
  const activeSelectedIds = selectedIds ?? internalSelectedIds;
  const activeExpandedIds = expandedIds ?? internalExpandedIds;
  const resolvedSelectedIds =
    selectionMode === "multiple"
      ? expandSelectedIds(nodes, activeSelectedIds)
      : activeSelectedIds;

  const setExpanded = (id: string) => {
    const nextExpandedIds = activeExpandedIds.includes(id)
      ? activeExpandedIds.filter((item) => item !== id)
      : [...activeExpandedIds, id];
    if (expandedIds === undefined) setInternalExpandedIds(nextExpandedIds);
    onExpandedChange?.(nextExpandedIds);
  };

  const selectNode = (node: TreeNode) => {
    if (node.disabled) return;
    if (selectionMode === "multiple") {
      const nextSelectedIds = new Set(resolvedSelectedIds);
      const descendantIds = collectSelectableIds(node);
      const ancestorIds = findAncestorIds(nodes, node.id) ?? [];
      const isSelected = nextSelectedIds.has(node.id);

      if (isSelected) {
        [...descendantIds, ...ancestorIds].forEach((id) =>
          nextSelectedIds.delete(id),
        );
      } else {
        descendantIds.forEach((id) => nextSelectedIds.add(id));
      }

      const nextSelection = [...nextSelectedIds];
      if (selectedIds === undefined) setInternalSelectedIds(nextSelection);
      onSelectionChange?.(nextSelection);
    } else {
      if (selectedId === undefined) setInternalSelectedId(node.id);
      onSelectionChange?.(node.id);
    }
    onSelect?.(node);
  };

  return (
    <ul
      className={cx("pango-tree", className)}
      role="tree"
      aria-label={label}
      aria-multiselectable={
        selectionMode === "multiple" ? true : undefined
      }
    >
      {nodes.map((node, index) => (
        <TreeItem
          key={node.id}
          node={node}
          level={1}
          position={index + 1}
          setExpanded={setExpanded}
          expandedIds={activeExpandedIds}
          selectedId={activeSelectedId}
          selectedIds={resolvedSelectedIds}
          selectionMode={selectionMode}
          selectNode={selectNode}
        />
      ))}
    </ul>
  );
}

function TreeItem({
  node,
  level,
  position,
  setExpanded,
  expandedIds,
  selectedId,
  selectedIds,
  selectionMode,
  selectNode,
}: {
  node: TreeNode;
  level: number;
  position: number;
  setExpanded: (id: string) => void;
  expandedIds: readonly string[];
  selectedId: string;
  selectedIds: readonly string[];
  selectionMode: TreeSelectionMode;
  selectNode: (node: TreeNode) => void;
}) {
  const children = node.children ?? [];
  const hasChildren = children.length > 0;
  const isExpanded = expandedIds.includes(node.id);
  const isSelected =
    selectionMode === "multiple"
      ? selectedIds.includes(node.id)
      : selectedId === node.id;

  return (
    <li
      className={cx(
        "pango-tree-item",
        !hasChildren && "is-leaf",
        selectionMode === "multiple" && "is-multiple",
        isSelected && "is-selected",
        node.disabled && "is-disabled",
      )}
      role="treeitem"
      aria-level={level}
      aria-posinset={position}
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
    >
      <div className="pango-tree-row">
        {hasChildren ? (
          <button
            className="pango-tree-toggle"
            type="button"
            aria-label={`${isExpanded ? "Collapse" : "Expand"} ${String(node.label)}`}
            aria-expanded={isExpanded}
            onClick={() => setExpanded(node.id)}
          >
            {isExpanded ? (
              <ChevronDown size={14} aria-hidden="true" />
            ) : (
              <ChevronRight size={14} aria-hidden="true" />
            )}
          </button>
        ) : (
          <span className="pango-tree-toggle-spacer" aria-hidden="true" />
        )}
        <button
          className="pango-tree-node"
          type="button"
          disabled={node.disabled}
          onClick={() => selectNode(node)}
        >
          {selectionMode === "multiple" && (
            <span
              className={cx(
                "pango-tree-checkbox",
                isSelected && "is-checked",
              )}
              aria-hidden="true"
            >
              {isSelected && <Check size={11} strokeWidth={3} />}
            </span>
          )}
          <span className="pango-tree-node-icon" aria-hidden="true">
            {node.icon ??
              (hasChildren ? (
                isExpanded ? (
                  <FolderOpen size={15} />
                ) : (
                  <Folder size={15} />
                )
              ) : null)}
          </span>
          <span className="pango-tree-node-copy">
            <strong>{node.label}</strong>
            {node.description && <small>{node.description}</small>}
          </span>
        </button>
      </div>
      {hasChildren && isExpanded && (
        <ul className="pango-tree-group" role="group">
          {children.map((child, index) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              position={index + 1}
              setExpanded={setExpanded}
              expandedIds={expandedIds}
              selectedId={selectedId}
              selectedIds={selectedIds}
              selectionMode={selectionMode}
              selectNode={selectNode}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TreeSelect({
  nodes,
  value,
  defaultValue = "",
  onValueChange,
  label,
  description,
  error,
  helperText,
  placeholder = "Select a location",
  defaultExpandedIds,
  className,
}: {
  nodes: readonly TreeNode[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  label?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  helperText?: ReactNode;
  placeholder?: ReactNode;
  defaultExpandedIds?: readonly string[];
  className?: string;
}) {
  const selectId = useStableId("tree-select");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const [open, setOpen] = useState(false);
  const selectedNode = findTreeNode(nodes, selectedValue);

  const close = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus)
      window.requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useOutsidePointer(open, [rootRef], () => setOpen(false));
  useEscapeKey(open, () => close(true));

  return (
    <InputField
      label={label}
      labelFor={selectId}
      description={description}
      error={error}
      helperText={helperText}
    >
      <div className={cx("pango-tree-select", className)} ref={rootRef}>
        <button
          ref={triggerRef}
          id={selectId}
          className="pango-tree-select-trigger"
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${selectId}-tree`}
          aria-haspopup="tree"
          aria-invalid={Boolean(error) || undefined}
          onClick={() => setOpen((current) => !current)}
        >
          <span className={cx(!selectedNode && "is-placeholder")}>
            {selectedNode?.label ?? placeholder}
          </span>
          <ChevronDown size={15} aria-hidden="true" />
        </button>
        {open && (
          <div
            className="pango-tree-select-menu"
            id={`${selectId}-tree`}
          >
            <TreeView
              nodes={nodes}
              label={label ? `${String(label)} options` : "Options"}
              selectedId={selectedValue}
              defaultExpandedIds={defaultExpandedIds}
              onSelect={(node) => {
                setSelectedValue(node.id);
                close(true);
              }}
            />
          </div>
        )}
      </div>
    </InputField>
  );
}

function findTreeNode(
  nodes: readonly TreeNode[],
  id: string,
): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const match = node.children && findTreeNode(node.children, id);
    if (match) return match;
  }
  return undefined;
}

function collectSelectableIds(node: TreeNode): string[] {
  if (node.disabled) return [];
  return [
    node.id,
    ...(node.children?.flatMap((child) => collectSelectableIds(child)) ?? []),
  ];
}

function expandSelectedIds(
  nodes: readonly TreeNode[],
  selectedIds: readonly string[],
): string[] {
  const selected = new Set(selectedIds);
  const expanded = new Set<string>();

  const visit = (node: TreeNode, parentSelected: boolean): boolean => {
    if (node.disabled) return false;

    const inheritedSelected = parentSelected || selected.has(node.id);
    const childSelections =
      node.children?.map((child) => ({
        child,
        selected: visit(child, inheritedSelected),
      })) ?? [];
    const selectableChildren = childSelections.filter(
      ({ child }) => collectSelectableIds(child).length > 0,
    );
    const allChildrenSelected =
      selectableChildren.length > 0 &&
      selectableChildren.every(({ selected: childSelected }) => childSelected);
    const isSelected = inheritedSelected || allChildrenSelected;

    if (isSelected) expanded.add(node.id);
    return isSelected;
  };

  nodes.forEach((node) => visit(node, false));
  return [...expanded];
}

function findAncestorIds(
  nodes: readonly TreeNode[],
  targetId: string,
  ancestors: readonly string[] = [],
): string[] | undefined {
  for (const node of nodes) {
    if (node.id === targetId) return [...ancestors];
    const match = node.children
      ? findAncestorIds(node.children, targetId, [...ancestors, node.id])
      : undefined;
    if (match) return match;
  }
  return undefined;
}
