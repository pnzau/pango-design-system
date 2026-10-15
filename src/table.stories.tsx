import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge, StatusChip } from './components/Primitives'
import { DataTable } from './table'
import type { DataTableColumn } from './table'

const meta = {
  title: 'Data/Data table',
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

type Project = {
  id: string
  name: string
  owner: string
  status: 'Ready' | 'Review' | 'Paused'
  updated: string
  budget: number
}

const projects: Project[] = [
  { id: 'dawn', name: 'Dawn Market', owner: 'Maya Imani', status: 'Ready', updated: '2 minutes ago', budget: 12800 },
  { id: 'harbor', name: 'Harbor Books', owner: 'Chidi Nwosu', status: 'Review', updated: '18 minutes ago', budget: 9600 },
  { id: 'fern', name: 'Fern Studio', owner: 'Taylor Okafor', status: 'Paused', updated: 'Yesterday', budget: 4800 },
  { id: 'northstar', name: 'Northstar', owner: 'Maya Imani', status: 'Ready', updated: 'Yesterday', budget: 18400 },
  { id: 'signal', name: 'Signal Works', owner: 'Chidi Nwosu', status: 'Review', updated: 'Monday', budget: 7200 },
  { id: 'folio', name: 'Folio Lab', owner: 'Taylor Okafor', status: 'Ready', updated: 'Monday', budget: 15600 },
  { id: 'meadow', name: 'Meadow House', owner: 'Maya Imani', status: 'Paused', updated: '6 May', budget: 3200 },
  { id: 'portal', name: 'Portal Archive', owner: 'Chidi Nwosu', status: 'Review', updated: '5 May', budget: 11200 },
]

const columns: DataTableColumn<Project>[] = [
  {
    accessorKey: 'name',
    header: 'Project',
    cell: ({ row }) => <span className="pango-table-project"><strong>{row.original.name}</strong><small>{row.original.updated}</small></span>,
  },
  { accessorKey: 'owner', header: 'Owner' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusChip tone={row.original.status === 'Ready' ? 'success' : row.original.status === 'Review' ? 'warning' : 'slate'}>{row.original.status}</StatusChip>,
  },
  {
    accessorKey: 'budget',
    header: 'Budget',
    cell: ({ row }) => <Badge tone="neutral">${row.original.budget.toLocaleString('en-US')}</Badge>,
  },
]

export const Default: Story = {
  name: 'Advanced interactions',
  render: () => <DataTable data={projects} columns={columns} caption="Projects" getRowId={(project) => project.id} pageSize={3} enableSelection defaultRowSelection={{ dawn: true }} defaultSorting={[{ id: 'name', desc: false }]} />,
}

export const IndeterminateSelection: Story = {
  render: () => <DataTable data={projects.slice(0, 3)} columns={columns} caption="Partially selected projects" getRowId={(project) => project.id} enableSelection defaultRowSelection={{ dawn: true }} showColumnControls={false} />,
}

export const Loading: Story = {
  render: () => <DataTable data={projects} columns={columns} caption="Projects loading" getRowId={(project) => project.id} enableSelection loading />,
}

export const Empty: Story = {
  name: 'No rows yet',
  render: () => <DataTable data={[]} columns={columns} caption="Projects" getRowId={(project) => project.id} />,
}

export const NoSearchMatches: Story = {
  render: () => <DataTable data={projects} columns={columns} caption="Projects" getRowId={(project) => project.id} defaultGlobalFilter="blueprint" />,
}
