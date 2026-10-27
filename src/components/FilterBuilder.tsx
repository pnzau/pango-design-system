import {
  BookmarkPlus,
  Filter,
  GitBranch,
  Plus,
  RotateCcw,
  Save,
  Ungroup,
  X,
} from "lucide-react";
import { Fragment, useRef, useState } from "react";
import type { ReactNode } from "react";
import { DragHandle, SortableList } from "../dnd";
import { cx, useControllableState, useStableId } from "../lib/utils";
import { DatePicker } from "./Forms";
import { EmptyState } from "./Data";
import { Button, IconButton, Input, Select } from "./Primitives";

export type FilterFieldType =
  | "text"
  | "number"
  | "date"
  | "select"
  | "boolean";

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterField = {
  id: string;
  label: string;
  type?: FilterFieldType;
  options?: readonly FilterOption[];
};

export type FilterOperator =
  | "is"
  | "is_not"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "is_empty"
  | "is_not_empty"
  | "greater_than"
  | "less_than"
  | "on_or_after"
  | "on_or_before";

export type FilterRule = {
  id: string;
  field: string;
  operator: FilterOperator;
  value?: string;
};

export type FilterAndGroup = {
  id: string;
  type: "and";
  rules: readonly FilterRule[];
};

export type FilterCondition = FilterRule | FilterAndGroup;

export type SavedFilterView = {
  id: string;
  name: string;
  filters: readonly FilterCondition[];
};

export function FilterBuilder({
  fields,
  value,
  defaultValue = [],
  onChange,
  savedViews = [],
  activeViewId,
  onActiveViewChange,
  onSaveView,
  onDeleteView,
  label = "Filters",
  className,
}: {
  fields: readonly FilterField[];
  value?: readonly FilterCondition[];
  defaultValue?: readonly FilterCondition[];
  onChange?: (filters: readonly FilterCondition[]) => void;
  savedViews?: readonly SavedFilterView[];
  activeViewId?: string;
  onActiveViewChange?: (viewId: string) => void;
  onSaveView?: (view: SavedFilterView) => void;
  onDeleteView?: (view: SavedFilterView) => void;
  label?: ReactNode;
  className?: string;
}) {
  const builderId = useStableId("filter-builder");
  const nextRuleId = useRef(0);
  const [filters, setFilters] = useControllableState<readonly FilterCondition[]>({
    value,
    defaultValue,
    onChange,
  });
  const [internalViewId, setInternalViewId] = useState(activeViewId ?? "");
  const [saveMode, setSaveMode] = useState(false);
  const [viewName, setViewName] = useState("");
  const currentViewId = activeViewId ?? internalViewId;
  const hasAndGroup = filters.some(isFilterAndGroup);
  const activeFilterCount = countFilterRules(filters);

  const updateFilters = (nextFilters: readonly FilterCondition[]) => {
    setFilters(nextFilters);
  };

  const addFilter = () => {
    const firstField = fields[0];
    if (!firstField) return;
    updateFilters([...filters, createFilterRule(firstField, nextRuleId)]);
  };

  const updateFilter = (id: string, changes: Partial<FilterRule>) => {
    updateFilters(
      filters.map((condition) => {
        if (isFilterAndGroup(condition)) {
          return {
            ...condition,
            rules: condition.rules.map((rule) =>
              rule.id === id ? { ...rule, ...changes } : rule,
            ),
          };
        }
        return condition.id === id ? { ...condition, ...changes } : condition;
      }),
    );
  };

  const removeFilter = (id: string) => {
    updateFilters(
      filters.flatMap<FilterCondition>((condition): FilterCondition[] => {
        if (!isFilterAndGroup(condition))
          return condition.id === id ? [] : [condition];
        const rules = condition.rules.filter((rule) => rule.id !== id);
        return rules.length ? [{ ...condition, rules }] : [];
      }),
    );
  };

  const groupFilterWithAnd = (id: string) => {
    const firstField = fields[0];
    if (!firstField) return;
    const nextRule = createFilterRule(firstField, nextRuleId);
    const groupId = `${builderId}-and-${nextRuleId.current}`;
    updateFilters(
      filters.map((condition) =>
        !isFilterAndGroup(condition) && condition.id === id
          ? {
              id: groupId,
              type: "and",
              rules: [condition, nextRule],
            }
          : condition,
      ),
    );
  };

  const addRuleToGroup = (groupId: string) => {
    const firstField = fields[0];
    if (!firstField) return;
    const nextRule = createFilterRule(firstField, nextRuleId);
    updateFilters(
      filters.map((condition) =>
        isFilterAndGroup(condition) && condition.id === groupId
          ? { ...condition, rules: [...condition.rules, nextRule] }
          : condition,
      ),
    );
  };

  const ungroup = (groupId: string) => {
    const nextConditions: FilterCondition[] = [];
    filters.forEach((condition) => {
      if (isFilterAndGroup(condition) && condition.id === groupId)
        nextConditions.push(...condition.rules);
      else nextConditions.push(condition);
    });
    updateFilters(nextConditions);
  };

  const reorderGroup = (groupId: string, rules: FilterRule[]) => {
    updateFilters(
      filters.map((condition) =>
        isFilterAndGroup(condition) && condition.id === groupId
          ? { ...condition, rules }
          : condition,
      ),
    );
  };

  const selectView = (viewId: string) => {
    if (activeViewId === undefined) setInternalViewId(viewId);
    onActiveViewChange?.(viewId);
    const view = savedViews.find((candidate) => candidate.id === viewId);
    if (view) updateFilters(cloneFilterConditions(view.filters));
  };

  const saveView = () => {
    const trimmedName = viewName.trim();
    if (!trimmedName || !onSaveView) return;
    const view: SavedFilterView = {
      id: `${builderId}-${Date.now()}`,
      name: trimmedName,
      filters: cloneFilterConditions(filters),
    };
    onSaveView(view);
    if (activeViewId === undefined) setInternalViewId(view.id);
    onActiveViewChange?.(view.id);
    setViewName("");
    setSaveMode(false);
  };

  return (
    <section className={cx("pango-filter-builder", className)} aria-label={String(label)}>
      <header className="pango-filter-builder-header">
        <div>
          <span className="pango-filter-builder-kicker">
            <Filter size={13} aria-hidden="true" />
            {label}
          </span>
          <strong>
            {activeFilterCount
              ? `${activeFilterCount} active filter${activeFilterCount === 1 ? "" : "s"}`
              : "All records"}
          </strong>
        </div>
        <div className="pango-filter-builder-actions">
          {savedViews.length > 0 && (
            <div className="pango-filter-builder-view-control">
              <Select
                className="pango-filter-builder-view-select"
                aria-label="Saved view"
                value={currentViewId}
                onValueChange={selectView}
                options={[
                  { value: "", label: "Saved views" },
                  ...savedViews.map((view) => ({
                    value: view.id,
                    label: view.name,
                  })),
                ]}
              />
            </div>
          )}
          {onSaveView && (
            <Button
              variant="ghost"
              size="sm"
              icon={<BookmarkPlus size={14} aria-hidden="true" />}
              onClick={() => setSaveMode((current) => !current)}
            >
              Save view
            </Button>
          )}
        </div>
      </header>

      {saveMode && onSaveView && (
        <div className="pango-filter-builder-save">
          <Input
            className="pango-filter-builder-save-input"
            value={viewName}
            aria-label="Saved view name"
            placeholder="Name this view"
            onChange={(event) => setViewName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") saveView();
            }}
          />
          <Button
            size="sm"
            icon={<Save size={14} aria-hidden="true" />}
            disabled={!viewName.trim()}
            onClick={saveView}
          >
            Save
          </Button>
        </div>
      )}

      <div className="pango-filter-builder-list">
        {hasAndGroup ? (
          <SortableList
            items={filters}
            getId={(condition) => condition.id}
            onReorder={updateFilters}
            className="pango-filter-builder-root-sortable-list"
            renderItem={(condition) => (
              <FilterConditionView
                condition={condition}
                fields={fields}
                draggable
                canGroup={!isFilterAndGroup(condition)}
                onChange={updateFilter}
                onRemove={removeFilter}
                onGroup={groupFilterWithAnd}
                onUngroup={ungroup}
                onAddToGroup={addRuleToGroup}
                onReorderGroup={reorderGroup}
              />
            )}
            overlay={(condition) => (
              <FilterDragPreview condition={condition} />
            )}
          />
        ) : (
          filters.map((condition, index) => (
            <Fragment key={condition.id}>
              {index > 0 && <FilterLogicDivider label="OR" />}
              <FilterConditionView
                condition={condition}
                fields={fields}
                canGroup={!isFilterAndGroup(condition)}
                onChange={updateFilter}
                onRemove={removeFilter}
                onGroup={groupFilterWithAnd}
                onUngroup={ungroup}
                onAddToGroup={addRuleToGroup}
                onReorderGroup={reorderGroup}
              />
            </Fragment>
          ))
        )}
        {!filters.length && (
          <EmptyState
            className="pango-filter-builder-empty"
            icon={<Filter size={19} aria-hidden="true" />}
            title="No filters applied"
            description={
              fields.length
                ? "All records are shown. Add a condition to narrow this view."
                : "No filter fields are available for this dataset."
            }
            action={
              <Button
                variant="soft"
                size="sm"
                icon={<Plus size={14} aria-hidden="true" />}
                disabled={!fields.length}
                onClick={addFilter}
              >
                Add filter
              </Button>
            }
          />
        )}
      </div>

      <footer className="pango-filter-builder-footer">
        {!!filters.length && (
          <Button
            variant="ghost"
            size="sm"
            icon={<Plus size={14} aria-hidden="true" />}
            disabled={!fields.length}
            onClick={addFilter}
          >
            Add filter
          </Button>
        )}
        {!!filters.length && (
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={13} aria-hidden="true" />}
            onClick={() => updateFilters([])}
          >
            Clear all
          </Button>
        )}
        {currentViewId && onDeleteView && (
          <IconButton
            label="Delete saved view"
            size="sm"
            tone="soft"
            onClick={() => {
              const view = savedViews.find((candidate) => candidate.id === currentViewId);
              if (view) {
                onDeleteView(view);
                if (activeViewId === undefined) setInternalViewId("");
                onActiveViewChange?.("");
              }
            }}
          >
            <X size={14} aria-hidden="true" />
          </IconButton>
        )}
      </footer>
    </section>
  );
}

function FilterConditionView({
  condition,
  fields,
  draggable = false,
  canGroup,
  onChange,
  onRemove,
  onGroup,
  onUngroup,
  onAddToGroup,
  onReorderGroup,
}: {
  condition: FilterCondition;
  fields: readonly FilterField[];
  draggable?: boolean;
  canGroup: boolean;
  onChange: (id: string, changes: Partial<FilterRule>) => void;
  onRemove: (id: string) => void;
  onGroup: (id: string) => void;
  onUngroup: (id: string) => void;
  onAddToGroup: (id: string) => void;
  onReorderGroup: (id: string, rules: FilterRule[]) => void;
}) {
  if (!isFilterAndGroup(condition)) {
    const field = fields.find((candidate) => candidate.id === condition.field);
    if (!field) return null;

    return (
      <FilterRuleRow
        filter={condition}
        field={field}
        fields={fields}
        draggable={draggable}
        canGroup={canGroup}
        onChange={(changes) => onChange(condition.id, changes)}
        onRemove={() => onRemove(condition.id)}
        onGroup={() => onGroup(condition.id)}
      />
    );
  }

  return (
    <section className="pango-filter-builder-and-group" aria-label="AND filter group">
      <header className="pango-filter-builder-and-header">
        {draggable && <DragHandle label="Reorder AND group" />}
        <span className="pango-filter-builder-logic" aria-hidden="true">
          AND
        </span>
        <div>
          <strong>Match all conditions</strong>
          <small>
            {condition.rules.length} condition
            {condition.rules.length === 1 ? "" : "s"}
          </small>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={<Ungroup size={14} aria-hidden="true" />}
          onClick={() => onUngroup(condition.id)}
        >
          Ungroup
        </Button>
      </header>
      <div className="pango-filter-builder-and-list">
        <SortableList
          items={condition.rules}
          getId={(rule) => rule.id}
          onReorder={(rules) => onReorderGroup(condition.id, rules)}
          className="pango-filter-builder-and-sortable-list"
          renderItem={(rule) => {
            const field = fields.find((candidate) => candidate.id === rule.field);
            if (!field) return null;
            return (
              <FilterRuleRow
                filter={rule}
                field={field}
                fields={fields}
                draggable
                onChange={(changes) => onChange(rule.id, changes)}
                onRemove={() => onRemove(rule.id)}
              />
            );
          }}
          overlay={(rule) => <FilterDragPreview condition={rule} />}
        />
      </div>
      <footer className="pango-filter-builder-and-footer">
        <Button
          variant="ghost"
          size="sm"
          icon={<Plus size={14} aria-hidden="true" />}
          onClick={() => onAddToGroup(condition.id)}
          disabled={!fields.length}
        >
          Add AND condition
        </Button>
      </footer>
    </section>
  );
}

function FilterDragPreview({ condition }: { condition: FilterCondition }) {
  if (isFilterAndGroup(condition)) {
    return (
      <div className="pango-filter-builder-drag-preview">
        <GitBranch size={14} aria-hidden="true" />
        AND group · {condition.rules.length} condition
        {condition.rules.length === 1 ? "" : "s"}
      </div>
    );
  }

  return <div className="pango-filter-builder-drag-preview">Filter condition</div>;
}

function FilterLogicDivider({ label }: { label: "AND" | "OR" }) {
  return (
    <div
      className="pango-filter-builder-logic-divider"
      role="separator"
      aria-label={`${label} condition`}
    >
      <span>{label}</span>
    </div>
  );
}

function FilterRuleRow({
  filter,
  field,
  fields,
  draggable = false,
  canGroup = false,
  onChange,
  onRemove,
  onGroup,
}: {
  filter: FilterRule;
  field: FilterField;
  fields: readonly FilterField[];
  draggable?: boolean;
  canGroup?: boolean;
  onChange: (changes: Partial<FilterRule>) => void;
  onRemove: () => void;
  onGroup?: () => void;
}) {
  const operatorOptions = operatorsFor(field);
  const valueRequired = !["is_empty", "is_not_empty"].includes(filter.operator);

  return (
    <div className={cx("pango-filter-builder-row", draggable && "has-drag-handle")}>
      {draggable && <DragHandle label="Reorder filter condition" />}
      <div className="pango-filter-builder-control">
        <Select
          className="pango-filter-builder-select"
          aria-label="Filter field"
          value={filter.field}
          options={fields.map((candidate) => ({
            value: candidate.id,
            label: candidate.label,
          }))}
          onValueChange={(fieldId) => {
            const nextField = fields.find((candidate) => candidate.id === fieldId) ?? field;
            onChange({
              field: nextField.id,
              operator: operatorsFor(nextField)[0]?.value ?? "is",
              value: "",
            });
          }}
        />
      </div>
      <div className="pango-filter-builder-control">
        <Select
          className="pango-filter-builder-select"
          aria-label="Filter operator"
          value={filter.operator}
          options={operatorOptions}
          onValueChange={(operator) => onChange({ operator: operator as FilterOperator })}
        />
      </div>
      {valueRequired && <FilterValueInput field={field} filter={filter} onChange={onChange} />}
      <div className="pango-filter-builder-row-actions">
        {canGroup && onGroup && (
          <IconButton label="Group with AND" size="sm" tone="soft" onClick={onGroup}>
            <GitBranch size={14} aria-hidden="true" />
          </IconButton>
        )}
        <IconButton label="Remove filter" size="sm" tone="soft" onClick={onRemove}>
          <X size={14} aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
}

function FilterValueInput({
  field,
  filter,
  onChange,
}: {
  field: FilterField;
  filter: FilterRule;
  onChange: (changes: Partial<FilterRule>) => void;
}) {
  if (field.type === "date") {
    return (
      <div className="pango-filter-builder-control pango-filter-builder-value-control">
        <DatePicker
          id={`filter-${filter.id}`}
          label=""
          value={filter.value ?? ""}
          placeholder="Pick a date"
          onValueChange={(value) => onChange({ value })}
        />
      </div>
    );
  }
  if (field.type === "select") {
    return (
      <div className="pango-filter-builder-control pango-filter-builder-value-control">
        <Select
          className="pango-filter-builder-value"
          aria-label="Filter value"
          value={filter.value ?? ""}
          placeholder="Choose a value"
          options={field.options ?? []}
          onValueChange={(value) => onChange({ value })}
        />
      </div>
    );
  }
  if (field.type === "boolean") {
    return (
      <div className="pango-filter-builder-control pango-filter-builder-value-control">
        <Select
          className="pango-filter-builder-value"
          aria-label="Filter value"
          value={filter.value ?? ""}
          placeholder="Choose a value"
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
          onValueChange={(value) => onChange({ value })}
        />
      </div>
    );
  }
  return (
    <div className="pango-filter-builder-control pango-filter-builder-value-control">
      <Input
        className="pango-filter-builder-value"
        aria-label="Filter value"
        type={field.type === "number" ? "number" : "text"}
        value={filter.value ?? ""}
        placeholder="Value"
        onChange={(event) => onChange({ value: event.target.value })}
      />
    </div>
  );
}

function createFilterRule(
  field: FilterField,
  nextRuleId: { current: number },
): FilterRule {
  nextRuleId.current += 1;
  return {
    id: `filter-${nextRuleId.current}`,
    field: field.id,
    operator: operatorsFor(field)[0]?.value ?? "is",
    value: "",
  };
}

function operatorsFor(field: FilterField) {
  if (field.type === "number")
    return [
      { value: "is", label: "is" },
      { value: "is_not", label: "is not" },
      { value: "greater_than", label: "greater than" },
      { value: "less_than", label: "less than" },
    ] as const;
  if (field.type === "date")
    return [
      { value: "is", label: "is" },
      { value: "on_or_after", label: "on or after" },
      { value: "on_or_before", label: "on or before" },
    ] as const;
  if (field.type === "select" || field.type === "boolean")
    return [
      { value: "is", label: "is" },
      { value: "is_not", label: "is not" },
    ] as const;
  return [
    { value: "contains", label: "contains" },
    { value: "not_contains", label: "does not contain" },
    { value: "is", label: "is" },
    { value: "is_not", label: "is not" },
    { value: "starts_with", label: "starts with" },
    { value: "is_empty", label: "is empty" },
    { value: "is_not_empty", label: "is not empty" },
  ] as const;
}

function isFilterAndGroup(condition: FilterCondition): condition is FilterAndGroup {
  return "type" in condition && condition.type === "and";
}

function cloneFilterConditions(
  conditions: readonly FilterCondition[],
): FilterCondition[] {
  return conditions.map((condition) =>
    isFilterAndGroup(condition)
      ? {
          ...condition,
          rules: condition.rules.map((rule) => ({ ...rule })),
        }
      : { ...condition },
  );
}

function countFilterRules(conditions: readonly FilterCondition[]): number {
  return conditions.reduce(
    (count, condition) =>
      count + (isFilterAndGroup(condition) ? condition.rules.length : 1),
    0,
  );
}
