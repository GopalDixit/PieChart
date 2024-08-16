import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserActivities = () => {
    const [userActivities, setUserActivities] = useState([]);
    const [view, setView] = useState('table');
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        fetch('http://52.168.1.54:8080/api/v1/userActivities')
            .then(response => response.json())
            .then(data => setUserActivities(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const filterData = () => {
        return userActivities.filter(activity => {
            return (
                (selectedUser === '' || activity.user === selectedUser) &&
                (selectedCategory === '' || activity.category === selectedCategory)
            );
        });
    };

    const renderTable = (filteredActivities) => (
        <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="border border-gray-300 px-6 py-3">ID</th>
                        <th className="border border-gray-300 px-6 py-3">User</th>
                        <th className="border border-gray-300 px-6 py-3">Category</th>
                        <th className="border border-gray-300 px-6 py-3">Details</th>
                        <th className="border border-gray-300 px-6 py-3">Timestamp</th>
                        <th className="border border-gray-300 px-6 py-3">IP Address</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredActivities.map(activity => (
                        <tr key={activity.id} className="hover:bg-gray-50">
                            <td className="border border-gray-300 px-6 py-3">{activity.id}</td>
                            <td className="border border-gray-300 px-6 py-3">{activity.user}</td>
                            <td className="border border-gray-300 px-6 py-3">{activity.category}</td>
                            <td className="border border-gray-300 px-6 py-3">{activity.details}</td>
                            <td className="border border-gray-300 px-6 py-3">{activity.timeStamp}</td>
                            <td className="border border-gray-300 px-6 py-3">{activity.ipAddress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const renderPieChart = (filteredActivities) => {
        const pieData = filteredActivities.reduce((acc, activity) => {
            const existingCategory = acc.find(item => item.name === activity.category);
            if (existingCategory) {
                existingCategory.value += 1;
            } else {
                acc.push({ name: activity.category, value: 1 });
            }
            return acc;
        }, []);

        return (
            <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                    <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        );
    };

    const uniqueUsers = [...new Set(userActivities.map(activity => activity.user))];
    const uniqueCategories = [...new Set(userActivities.map(activity => activity.category))];

    const filteredActivities = filterData();

    return (
        <div className="container mx-auto p-8 min-h-screen flex flex-col">
            <div className="flex flex-wrap justify-between items-center mb-8">
                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    <select
                        className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                    >
                        <option value="">All Users</option>
                        {uniqueUsers.map(user => (
                            <option key={user} value={user}>
                                {user}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="w-full md:w-1/4 mb-4 md:mb-0">
                    <select
                        className="w-full px-4 py-2 bg-gray-300 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {uniqueCategories.map(category => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>


                <div className="w-full md:w-1/4 flex space-x-4 mt-4" style={{marginTop:35}}>
                    <button
                        className={`w-1/2 px-4 py-2 ${view === 'table' ? 'bg-blue-500' : 'bg-gray-300'} text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400`}
                        style={{marginRight:15}}
                        onClick={() => setView('table')}
                    >
                        Table View
                    </button>
                    <button
                        className={`w-1/2 px-4 py-2 ${view === 'pie' ? 'bg-green-500' : 'bg-red-300'} text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400`}
                        style={{backgroundColor:'green',color:"white"}}
                        onClick={() => setView('pie')}
                    >
                        Pie Chart View
                    </button>
                </div>
            </div>

            <div className="flex-grow">
                {view === 'table' ? renderTable(filteredActivities) : renderPieChart(filteredActivities)}
            </div>
        </div>
    );
};

export default UserActivities;
