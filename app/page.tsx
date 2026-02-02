import connectDB from '@/lib/mongodb';
import Job from '@/models/Job';
import { addJob, deleteJob, updateStatus } from './actions';

export default async function Home() {
  // 1. Connect and Fetch Data
  await connectDB();
  const jobs = await Job.find({}).sort({ dateApplied: -1 });

  // 2. Helper for Status Badge Colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted': return 'bg-green-100 text-green-700 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      case 'Interviewing': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Internship Tracker</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Full-Stack Proof of Work</p>
        </header>

        {/* SECTION: ADD NEW JOB */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Add New Application</h2>
          <form action={addJob} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Company</label>
              <input 
                name="company" 
                placeholder="e.g. Microsoft" 
                className="border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 text-black outline-none" 
                required 
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Role</label>
              <input 
                name="role" 
                placeholder="e.g. Frontend Intern" 
                className="border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 text-black outline-none" 
                required 
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Link</label>
              <input 
                name="link" 
                placeholder="https://..." 
                className="border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 text-black outline-none" 
              />
            </div>
            <button 
              type="submit" 
              className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all font-bold shadow-md active:scale-[0.99]"
            >
              Save Application
            </button>
          </form>
        </section>

        {/* SECTION: JOB LIST */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xl font-bold text-slate-800">My Applications</h2>
            <span className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-bold">
              {jobs.length} Total
            </span>
          </div>
          
          {jobs.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400">No applications added yet. Start applying! 🚀</p>
            </div>
          )}

          {jobs.map((job) => (
            <div key={job._id.toString()} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row justify-between gap-6">
              
              {/* LEFT SIDE: Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-xl text-slate-900">{job.company}</h3>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-slate-600 font-semibold">{job.role}</p>
                <div className="mt-4 flex items-center gap-4 text-xs font-medium">
                   {job.link && (
                     <a href={job.link} target="_blank" className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                       View Posting ↗
                     </a>
                   )}
                   <span className="text-slate-400">
                     Added: {new Date(job.dateApplied).toLocaleDateString()}
                   </span>
                </div>
              </div>

              {/* RIGHT SIDE: Management Actions */}
              <div className="flex flex-row md:flex-col items-center justify-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                
                {/* UPDATE STATUS FORM */}
                <form action={updateStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={job._id.toString()} />
                  <select 
                    name="status" 
                    defaultValue={job.status}
                    className="text-xs border border-slate-300 rounded-md p-1.5 bg-white text-black outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button 
                    type="submit" 
                    className="text-[10px] bg-slate-800 text-white px-2 py-1.5 rounded-md font-bold uppercase hover:bg-slate-700 transition"
                  >
                    Update
                  </button>
                </form>

                {/* DELETE FORM */}
                <form action={deleteJob}>
                  <input type="hidden" name="id" value={job._id.toString()} />
                  <button 
                    type="submit" 
                    className="text-xs text-red-400 hover:text-red-600 font-bold px-2 py-1 transition"
                  >
                    Delete
                  </button>
                </form>

              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}