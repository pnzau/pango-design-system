import { GripVertical } from "lucide-react";
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import {
  DragDropProvider,
  DragOverlay,
  useDraggable,
  useDroppable,
} from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { arrayMove } from "@dnd-kit/helpers";
import { cx } from "./lib/utils";

type DragHandleContextValue = {
  handleRef: (element: Element | null) => void;
} | null;
const DragHandleContext = createContext<DragHandleContextValue>(null);

export function Draggable({
  id,
  children,
  disabled = false,
  className,
}: {
  id: string | number;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
}) {
  const { ref, handleRef, isDragging } = useDraggable({ id, disabled });
  return (
    <DragHandleContext.Provider value={{ handleRef }}>
      <div
        ref={(element) => ref(element)}
        className={cx(
          "pango-draggable",
          isDragging && "is-dragging",
          className,
        )}
      >
        {children}
      </div>
    </DragHandleContext.Provider>
  );
}

export function Droppable({
  id,
  children,
  className,
}: {
  id: string | number;
  children: ReactNode;
  className?: string;
}) {
  const { ref, isDropTarget } = useDroppable({ id });
  return (
    <div
      ref={(element) => ref(element)}
      className={cx(
        "pango-droppable",
        isDropTarget && "is-drop-target",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DragHandle({
  label = "Drag to reorder",
  className,
}: {
  label?: string;
  className?: string;
}) {
  const context = useContext(DragHandleContext);
  if (!context)
    throw new Error(
      "DragHandle must be rendered inside Draggable or SortableList",
    );
  return (
    <button
      ref={(element) => context.handleRef(element)}
      type="button"
      className={cx("pango-drag-handle", className)}
      aria-label={label}
    >
      <GripVertical size={16} />
    </button>
  );
}

export function SortableList<T>({
  items,
  getId,
  onReorder,
  renderItem,
  className,
  overlay,
  as: Container = "div",
  itemAs = "div",
}: {
  items: readonly T[];
  getId: (item: T) => string | number;
  onReorder: (items: T[]) => void;
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  overlay?: (item: T) => ReactNode;
  as?: "div" | "ol" | "ul";
  itemAs?: "div" | "li";
}) {
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const activeItem =
    activeId === null
      ? undefined
      : items.find((item) => getId(item) === activeId);
  return (
    <DragDropProvider
      onDragStart={(event) => {
        const sourceId = event.operation.source?.id;
        setActiveId(sourceId == null ? null : (sourceId as string | number));
      }}
      onDragEnd={(event) => {
        setActiveId(null);
        const sourceId = event.operation.source?.id;
        const targetId = event.operation.target?.id;
        if (
          event.canceled ||
          sourceId == null ||
          targetId == null ||
          sourceId === targetId
        )
          return;
        const from = items.findIndex((item) => getId(item) === sourceId);
        const to = items.findIndex((item) => getId(item) === targetId);
        if (from >= 0 && to >= 0) onReorder(arrayMove([...items], from, to));
      }}
    >
      <Container className={cx("pango-sortable-list", className)}>
        {items.map((item, index) => (
          <SortableItem
            key={getId(item)}
            id={getId(item)}
            index={index}
            as={itemAs}
          >
            {renderItem(item, index)}
          </SortableItem>
        ))}
      </Container>
      {overlay && (
        <DragOverlay>{activeItem ? overlay(activeItem) : null}</DragOverlay>
      )}
    </DragDropProvider>
  );
}

export function SortableGrid<T>({
  columns = 3,
  className,
  ...props
}: Omit<Parameters<typeof SortableList<T>>[0], "className"> & {
  columns?: number;
  className?: string;
}) {
  return (
    <SortableList {...props} className={cx("pango-sortable-grid", className)} />
  );
}

function SortableItem({
  id,
  index,
  children,
  as: Item = "div",
}: {
  id: string | number;
  index: number;
  children: ReactNode;
  as?: "div" | "li";
}) {
  const { ref, handleRef, isDragging, isDropTarget } = useSortable({
    id,
    index,
  });
  return (
    <DragHandleContext.Provider value={{ handleRef }}>
      <Item
        ref={(element: Element | null) => ref(element)}
        className={cx(
          "pango-sortable-item",
          isDragging && "is-dragging",
          isDropTarget && "is-drop-target",
        )}
      >
        {children}
      </Item>
    </DragHandleContext.Provider>
  );
}
