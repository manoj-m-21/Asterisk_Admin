import React from 'react'
import "../styles/CallLogs.css"

function CallLogs() {
  return (

    <div className='call-logs-page'>
        <h1> 📃 CALL LOGS</h1>
        <div>
            <table className='call-logs-table'>
                <tr>
                    <th>Sl.No</th>
                    <th>Name</th>
                    <th>Date</th>
                    <th>Duration</th>
                </tr>
            </table>
        </div>
    </div>
    
  )
}

export default CallLogs