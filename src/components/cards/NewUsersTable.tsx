import useFetchUsers from "@/src/hooks/useFetchUsers";
import SkeletonTableLoader from "../skeletons/SkeletonTableLoader";

export default function NewUsers() {
  const { users, isLoading, isError } = useFetchUsers(1, 3,"");

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold font-[satoshi]">New Users</h2>
        <a href="#" className="text-secondary text-medium font-[satoshi]">
          View All
        </a>
      </div>

      {isLoading ? (
        <SkeletonTableLoader
          headings={["Name", "E-mail", "Status"]}
          rowCount={3}
        />
        ) : isError ? (
        <div className="text-red-500 py-10 text-center">Error loading users</div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No new users found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#27AAE11A] text-left">
              <tr>
                <th className="px-4 py-2 text-sm text-black font-semibold">Name</th>
                <th className="px-4 py-2 text-sm text-black font-semibold">E-mail</th>
                <th className="px-4 py-2 text-sm text-black font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="border-t border-gray-100">
                  <td className="px-4 py-2">
                    <a href="#" className="text-primary font-semibold">
                      {user.name.firstName} {user.name.lastName}
                    </a>
                  </td>
                  <td className="px-4 py-2 text-gray-600">{user.email ? user.email : "N/A"}</td>
                  <td className="px-4 py-2">
                    <span className="inline-block bg-[#71FB5533] text-[#20C000] text-sm font-semibold px-4 py-2 rounded-xl">
                      {user.verificationStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}