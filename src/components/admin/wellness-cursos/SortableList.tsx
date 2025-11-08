'use client'

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface SortableItemProps {
  id: string
  children: (listeners: any, attributes: any, isDragging: boolean) => React.ReactNode
}

function SortableItem({ id, children }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1
  }

  return (
    <div ref={setNodeRef} style={style}>
      {children(listeners, attributes, isDragging)}
    </div>
  )
}

interface SortableListProps<T extends { id: string }> {
  items: T[]
  onReorder: (newOrder: T[]) => void
  children: (item: T, index: number, listeners: any, attributes: any, isDragging: boolean) => React.ReactNode
  disabled?: boolean
}

export default function SortableList<T extends { id: string }>({
  items,
  onReorder,
  children,
  disabled = false
}: SortableListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id)
      const newIndex = items.findIndex(item => item.id === over.id)

      const newOrder = arrayMove(items, oldIndex, newIndex)
      
      // Atualizar ordem numérica
      const reordered = newOrder.map((item, index) => ({
        ...item,
        ordem: index
      }))

      onReorder(reordered)
    }
  }

  if (disabled) {
    return <>{items.map((item, index) => children(item, index, {}, {}, false))}</>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {items.map((item, index) => (
          <SortableItem key={item.id} id={item.id}>
            {(listeners, attributes, isDragging) => children(item, index, listeners, attributes, isDragging)}
          </SortableItem>
        ))}
      </SortableContext>
    </DndContext>
  )
}

