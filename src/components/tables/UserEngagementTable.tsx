"use client";

import { User } from "@/src/lib/types/User";
import ExpandableId from "../ui/ExpandableId";

interface Props {
  headings: string[];
  data: User[];
}

const UserEngagementTable: React.FC<Props> = ({ data, headings }) => {
  return (
    <div className={`flex-1 rounded-lg w-full py-5`}>
      {/* Table */}
      <div className="rounded-lg overflow-x-auto w-full min-h-[200px] pb-[30px]">
        <table className="w-full text-left table-auto min-w-[600px]">
          <thead className="bg-secondary/10">
            <tr className="font-satoshi text-[12px] sm:text-[16px] whitespace-nowrap">
              {headings.map((heading, index) => (
                <th key={index} className="p-4 sm:p-4 text-left font-[700]">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((user, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-200 text-[12px] sm:text-[16px]"
                >
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    <ExpandableId id={user._id} />
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi font-bold text-primary whitespace-nowrap">
                    {user.name
                      ? user.name.firstName + " " + user.name.lastName
                      : "N/A"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    {user.loginFrequency
                      ? user.loginFrequency.toFixed(4)
                      : "N/A"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    {user.averageTime ? user.averageTime.toFixed(4) : "N/A"}
                  </td>
                  <td className="px-2 sm:px-4 py-3 sm:py-4 font-satoshi whitespace-nowrap">
                    {user.lastActivity ? user.lastActivity : "N/A"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserEngagementTable;
