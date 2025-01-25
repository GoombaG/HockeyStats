import React from 'react'
import axios, {AxiosResponse} from 'axios'
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useMemo} from 'react'


export type Player = {
    id: number
    firstName: string
    lastName: string
    fullName: string
    position: string
    country: string
    goals: number
    assists: number
    points: number
    goalStreak: number
    assistStreak: number
    pointStreak: number
}

function Streaks() {
    const [streaksData, setStreaksData] = React.useState<Player[]>([])
    const streaksColumnHelper = createColumnHelper<Player>()
    const streaksColumns = useMemo(() => [
        streaksColumnHelper.group({
            id: 'PlayerData',
            header: 'Player',
            columns: [
              /*  streaksColumnHelper.accessor('id', {
                    id: 'id',
                    header: () => <span>id</span>,
                    cell: info => info.getValue(),
                }),*/
                streaksColumnHelper.accessor('fullName', {
                    id: 'fullName',
                    header: () => <span>Name</span>,
                    cell: info => info.getValue(),
                }),
                streaksColumnHelper.accessor('country', {
                    id: 'country',
                    header: () => <span>Country</span>,
                    cell: info => info.getValue(),
                }),
                streaksColumnHelper.accessor('position', {
                    id: 'position',
                    header: () => <span>Position</span>,
                    cell: info => info.getValue(),
                }),
            ]
        }),
        /*streaksColumnHelper.group({
            id: 'Stats',
            header: 'General Stats',
            columns: [
                
            ]
        }),*/ 
        streaksColumnHelper.group({
            id: 'Streaks',
            header: 'Active Streaks',
            columns: [
                streaksColumnHelper.accessor('goalStreak', {
                    id: 'goalStreak',
                    header: () => <span>Goals</span>,
                    cell: info => info.getValue(),
                }),
                streaksColumnHelper.accessor('assistStreak', {
                    id: 'assistStreak',
                    header: () => <span>Assists</span>,
                    cell: info => info.getValue(),
                }),
                streaksColumnHelper.accessor('pointStreak', {
                    id: 'pointStreak',
                    header: () => <span>Points</span>,
                    cell: info => info.getValue(),
                }),
            ]
        })
    ], [])



    const fetchStreaksAPI = async () => {
        const response = await axios.get("http://localhost:8081/streaks")
        return response
    }
    
    function setStreaksValues(streaks: AxiosResponse<any, any>) {
        setStreaksData([])

        for (const player in streaks.data) {
            const playerData = {
                id: streaks.data[player].id,
                firstName: streaks.data[player].firstName,
                lastName: streaks.data[player].lastName,
                fullName: streaks.data[player].firstName + ' ' + streaks.data[player].lastName,
                position: streaks.data[player].position,
                country: streaks.data[player].country,
                goalStreak: streaks.data[player].goalStreak,
                assistStreak: streaks.data[player].assistStreak,
                pointStreak: streaks.data[player].pointStreak,
            }
            setStreaksData(oldStreaksData => [...oldStreaksData, playerData])
        };
        console.log(streaksData)
    }

    React.useEffect(() => {
        const fetchDetails = async () => {
            try {
                const streaksAPIResults = await fetchStreaksAPI();
                setStreaksValues(streaksAPIResults)
            } catch (error) {
                console.log(error);
            }
        };
        fetchDetails();
        }, []);

    const streaksTable = useReactTable({
        data: streaksData, 
        columns: streaksColumns, 
        getCoreRowModel: getCoreRowModel(),
    })
      /*  getRowCanExpand: () => canRowExpand(),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onSortingChange: setSorting,
        initialState: {
            columnVisibility: {
                games: false,
            },
        },
        state: {
            sorting
        }
    */

    return (
    <>
        <h1>Standings</h1>
        <div>
            <table>
                <thead>
                {streaksTable.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                        return (
                            <th key={header.id} colSpan={header.colSpan}>
                                {header.isPlaceholder ? null : (
                                <div
                               /*     className={
                                    header.column.getCanSort()
                                        ? 'cursor-pointer select-none'
                                        : ''
                                    }
                                    onClick={header.column.getToggleSortingHandler()}
                                    title={
                                    header.column.getCanSort()
                                        ? header.column.getNextSortingOrder() === 'asc'
                                        ? 'Sort ascending'
                                        : header.column.getNextSortingOrder() === 'desc'
                                            ? 'Sort descending'
                                            : 'Clear sort'
                                        : undefined
                                    }*/
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                </div>
                                )}
                            </th> 
                        )
                    })}
                    </tr>
                ))}
                </thead>
                <tbody>
                {/*Now render the cells*/}
                {streaksTable.getRowModel().rows.map((row) => (
                    <>
                        <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                        </tr>
                    </>
                ))}
                </tbody>
            </table>
        </div>
    </>
    )
}

export default Streaks