import { useState, useMemo} from 'react'
import axios, {AxiosResponse} from 'axios'
import React from 'react'
import { 
    createColumnHelper, 
    getCoreRowModel, 
    getSortedRowModel,
    getExpandedRowModel,
    useReactTable, 
    flexRender,
} from '@tanstack/react-table'
import './Standings.css'
import GamesTable from './GamesTable'

export type Game = {
    awayAbbrev: string
    homeAbbrev: string
    awayLogo: string
    homeLogo: string
    awayLogoDark: string // currently unused
    homeLogoDark: string // currently unused
    awayScore: number
    homeScore: number
    lastPeriodType: string
    gameDate: string
}

export type Team = {
    gamesPlayed: number
    standing: number
    losses: number
    otLosses: number
    pointsPercentage: number
    points: number
    teamAbbrev: string
    teamName: string
    wins: number
    logo: string
    games?: Game[]
}

function canRowExpand() {
    return true
}

function getColspan(headerId: string): number {
    console.log(headerId)
    if (headerId == 'expander') {
        return 2
    } else if (headerId == 'teamName') {
        return 0
    }
    return 1
}

function Standings() {   
    // STANDINGS DATA
    const [standingsData, setStandingsData] = React.useState<Team[]>([])
    const standingsColumnHelper = createColumnHelper<Team>()
    const standingsColumns = useMemo(() => [
        standingsColumnHelper.group({
            id: 'Rank',
            header: '',
            footer: '',
            columns: [
                standingsColumnHelper.accessor('standing', {
                    header: () => <span>Rank</span>,
                    cell: info => info.getValue(),
                }),
            ]
        }),
        standingsColumnHelper.group({
            id: 'Team',
            header: 'Team',
            footer: 'Test',
            columns: [
                standingsColumnHelper.display({
                    id: 'expander',
                    header: () => <span>Team</span>,
                    cell: ({ row }) => {
                      return row.getCanExpand() ? (
                        <button
                          {...{
                            onClick: row.getToggleExpandedHandler(),
                            style: { cursor: 'pointer', backgroundColor: 'transparent'},
                          }}
                        >
                          {(<img src={row.original.logo} alt="Home Logo" width="35" height="35"></img>)}
                        </button>
                      ) : (
                        '🔵'
                      )
                    },
                }),
                standingsColumnHelper.accessor('teamName', {
                    id: 'teamName',
                    //header: () => <span>Team</span>,
                    cell: info => info.getValue(),
                })
            ]
        }),
        standingsColumnHelper.group({
            id: 'Stats',
            header: '',
            footer: 'Test',
            columns: [
                standingsColumnHelper.accessor('gamesPlayed', {
                    header: () => <span>GP</span>,
                    cell: info => info.getValue(),
                }),
                standingsColumnHelper.accessor('wins', {
                    header: () => <span>W</span>,
                    cell: info => info.getValue(),
                }),
                standingsColumnHelper.accessor('losses', {
                    header: () => <span>L</span>,
                    cell: info => info.getValue(),
                }),
                standingsColumnHelper.accessor('otLosses', {
                    header: () => <span>OTL</span>,
                    cell: info => info.getValue(),
                }),
                standingsColumnHelper.accessor('points', {
                    header: () => <span>P</span>,
                    cell: info => info.getValue(),
                }),
                standingsColumnHelper.accessor('pointsPercentage', {
                    header: () => <span>P%</span>,
                    cell: info => info.getValue().toFixed(3),
                }),
            ]
        }), 
    ], [])

    const fetchStandingsAPI = async () => {
        const response = await axios.get("http://localhost:8081/standings")
        return response 
    }

    // END STANDINGS DATA

    // START GAMES DATA

    const fetchGamesAPI = async () => {
        const response = await axios.get("http://localhost:8081/completedGames")
        return response
    }

    // END GAMES DATA

    function SetStandingsValues(standings: AxiosResponse<any, any>, games: AxiosResponse<any, any>) {
        setStandingsData([])

        for (const team in standings.data) {
            let teamGamesData: Game[] = []
            let teamLogo: string = ""
            for (const game in games.data[team]) {
                const newGame = {
                    awayAbbrev: games.data[team][game].awayAbbrev,
                    homeAbbrev: games.data[team][game].homeAbbrev,
                    awayLogo: games.data[team][game].awayLogo,
                    homeLogo: games.data[team][game].homeLogo,
                    awayLogoDark: games.data[team][game].awayLogoDark,
                    homeLogoDark: games.data[team][game].homeLogoDark,
                    awayScore: games.data[team][game].awayScore,
                    homeScore: games.data[team][game].homeScore,
                    lastPeriodType: games.data[team][game].lastPeriodType,
                    gameDate: games.data[team][game].gameDate,
                }
                teamGamesData.push(newGame)
            };

            // relies on data for at least one game existing
            // this game isn't listed with team data
            if (teamGamesData.length > 0) {
                if (teamGamesData[0].homeAbbrev == team) {
                    teamLogo = teamGamesData[0].homeLogo
                } else {
                    teamLogo = teamGamesData[0].awayLogo
                }
            }

            const newTeam = {
                gamesPlayed: standings.data[team].gamesPlayed,
                losses: standings.data[team].losses,
                otLosses: standings.data[team].otLosses,
                points: standings.data[team].points,
                standing: standings.data[team].leagueSequence,
                pointsPercentage: standings.data[team].pointPctg,
                teamAbbrev: team,
                teamName: standings.data[team].teamName,
                wins: standings.data[team].wins,
                logo: teamLogo,
                games: teamGamesData
            }
            setStandingsData(oldStandingsData => [...oldStandingsData, newTeam])
        };
    }

    // API calls
    React.useEffect(() => {
        const fetchDetails = async () => {
          try {
            const standingsAPIResults = await fetchStandingsAPI();
            const gamesAPIResults = await fetchGamesAPI();
            SetStandingsValues(standingsAPIResults, gamesAPIResults)
          } catch (error) {
            console.log(error);
          }
        };
        fetchDetails();
      }, []);

    // Sorting settings for standings table
    type ColumnSort = {
        id: string
        desc: boolean
    }
    type SortingState = ColumnSort[]
    const [sorting, setSorting] = useState<SortingState>([
        {id: "standing", desc: false}
    ])

    const standingsTable = useReactTable({
        data: standingsData, 
        columns: standingsColumns, 
        
        getRowCanExpand: () => canRowExpand(),
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
        },
    })

    return (
        <>
            <h1>Standings</h1>
            <div>
                <table>
                    <thead>
                    {standingsTable.getHeaderGroups().map(headerGroup => (
                        headerGroup.id == "0" ? null :
                        <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => {
                            return (
                                (getColspan(header.id) != 0) ?
                                <th key={header.id} colSpan={getColspan(header.id)}>
                                    {header.isPlaceholder ? null : (
                                    <div
                                        className={
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
                                        }
                                    >
                                        {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                        )}
                                        {{

                                        }[header.column.getIsSorted() as string] ?? null}
                                    </div>
                                    )}
                                </th> 
                                : null
                            )
                        })}
                        </tr>
                    ))}
                    </thead>
                    <tbody>
                    {/*Now render the cells*/}
                    {standingsTable.getRowModel().rows.map((row) => (
                        <>
                            <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                            </tr>
                            {row.getIsExpanded() && (
                                <GamesTable row={row}/>
                            )}
                        </>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Standings
