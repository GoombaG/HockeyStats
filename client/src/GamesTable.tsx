import { 
    Row,
} from '@tanstack/react-table'
import type {Team} from './Standings.tsx'
import './GamesTable.css'

function GamesTable({ row }: { row: Row<Team> }) {
    //console.log(row.original.games)
    return (
        <tr>

            <td colSpan={row.getVisibleCells().length} className={"gamesTable"}>
                <table width={507}>
                    <thead>
                        <tr>
                            <th colSpan={5} className='gamesHeader1'>
                                Recent Games
                            </th>
                        </tr>
                        <tr>
                        <th className='gamesHeader2'>
                            Date
                        </th>
                        <th colSpan={2} className='gamesHeader2'>
                            Home
                        </th>
                        <th colSpan={2} className='gamesHeader2'>
                            Away
                        </th>
                        </tr>

                    </thead>
                    <tbody>
                    {(!row || !row.original || !row.original.games) ? null : (
                    row.original.games.slice(-5).reverse().map((game) =>
                        <tr className='gamesRow'>
                            <td className='gamestd'>
                                {game.gameDate}
                            </td>
                            <td className='gamestd'>
                                {game.awayScore}
                            </td>
                            <td className='gamestd'>
                                {game.awayAbbrev}
                            </td>
                            <td className='gamestd'>
                                {game.homeAbbrev}
                            </td>
                            <td className='gamestd'>
                                {game.homeScore}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>             
            </td>
        </tr>
    )
}

export default GamesTable