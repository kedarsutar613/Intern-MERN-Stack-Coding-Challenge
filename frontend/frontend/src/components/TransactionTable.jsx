// frontend/src/components/TransactionTable.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionTable = () => {
    const [transactions, setTransactions] = useState([]);
    const [month, setMonth] = useState("March");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchTransactions();
    }, [month, search, page]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/transactions', {
                params: { month, search, page }
            });
            setTransactions(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleNextPage = () => setPage(prev => prev + 1);
    const handlePreviousPage = () => setPage(prev => Math.max(prev - 1, 1));

    return (
        <div>
            <select value={month} onChange={e => setMonth(e.target.value)}>
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(m => (
                    <option key={m} value={m}>{m}</option>
                ))}
            </select>
            <input 
                type="text" 
                placeholder="Search..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
            />
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map(transaction => (
                        <tr key={transaction._id}>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>${transaction.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={handlePreviousPage}>Previous</button>
            <button onClick={handleNextPage}>Next</button>
        </div>
    );
};

export default TransactionTable;
