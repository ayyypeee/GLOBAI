import { Empty } from '../../shared/ui'

function Requests() {
  return (
    <div className="tp-page">
      <div className="ui-head">
        <div>
          <h1>Join requests</h1>
          <p>Accept the students who entered your course code.</p>
        </div>
      </div>

      <div className="ui-card">
        <div className="ui-table-wrap">
          <table className="ui-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Requested</th>
                <th>Actions</th>
              </tr>
            </thead>
          </table>
        </div>
        <Empty title="No pending requests" text="Student join requests will show up here." />
      </div>
    </div>
  )
}

export default Requests