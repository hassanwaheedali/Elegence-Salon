import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

const SortableHeader = ({ field, currentSort, onSort, children }) => {
    const isActive = currentSort.field === field
    const isAsc = isActive && currentSort.direction === 'asc'
    const isDesc = isActive && currentSort.direction === 'desc'

    return (
        <th
            className="px-6 py-5 cursor-pointer select-none hover:text-champagne transition-colors group"
            onClick={() => onSort(field)}
        >
            <div className="flex items-center gap-2">
                <span>{children}</span>
                <span className={`transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                    {!isActive && <ChevronsUpDown size={14} />}
                    {isAsc && <ChevronUp size={14} className="text-champagne" />}
                    {isDesc && <ChevronDown size={14} className="text-champagne" />}
                </span>
            </div>
        </th>
    )
}

export default SortableHeader
