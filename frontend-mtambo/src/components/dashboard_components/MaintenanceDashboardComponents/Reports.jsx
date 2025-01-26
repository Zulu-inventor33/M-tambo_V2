import React, { useState, useEffect } from 'react';
import ApexCharts from 'react-apexcharts';

import useThemeMode from '../../../hooks/useThemeMode';
import PaginationControl from '../Tables/PaginationControl';

const Reports = () => {
    const themeMode = useThemeMode();
    const [chartOptions, setChartOptions] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const taskData = [
        { name: "John Smith", assigned: 48, completed: 41, pending: 5, overdue: 2 },
        { name: "Emily Johnson", assigned: 62, completed: 54, pending: 6, overdue: 2 },
        { name: "Michael Brown", assigned: 52, completed: 40, pending: 8, overdue: 4 },
        { name: "Sarah Williams", assigned: 60, completed: 50, pending: 6, overdue: 4 },
        { name: "David Jones", assigned: 75, completed: 68, pending: 5, overdue: 2 },
        { name: "Jessica Taylor", assigned: 63, completed: 56, pending: 4, overdue: 3 },
        { name: "James Lee", assigned: 49, completed: 42, pending: 4, overdue: 3 },
        { name: "Olivia Harris", assigned: 56, completed: 47, pending: 6, overdue: 3 },
        { name: "Daniel Clark", assigned: 66, completed: 58, pending: 6, overdue: 2 },
        { name: "Ava Lewis", assigned: 54, completed: 49, pending: 3, overdue: 2 },
    ];

    // Calculate the total number of pages
    const totalPages = Math.ceil(taskData.length / rowsPerPage);

    // Slice the data into pages
    const pagedData = taskData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    useEffect(() => {
        const chartColors = themeMode === 'dark'
            ? ['#068e44', '#FF9800', '#D32F2F']
            : ['#068e44', '#FF9800', '#D32F2F'];

        const gridLineColor = themeMode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.2)';
        const legendLabelColor = themeMode === 'dark' ? '#FFFFFFDE' : 'rgb(38, 38, 38)';
        const xaxisTitleColor = themeMode === 'dark' ? '#FFFFFFDE' : 'rgb(38, 38, 38)';
        const tooltipBgColor = themeMode === 'dark' ? 'rgb(38, 38, 38)' : '#fff';
        const tooltipTextColor = themeMode === 'dark' ? '#FFFFFFDE' : 'rgb(38, 38, 38)';

        setChartOptions({
            series: [
                { name: 'Completed Tasks', data: pagedData.map(item => item.completed) },
                { name: 'Pending Tasks', data: pagedData.map(item => item.pending) },
                { name: 'Overdue Tasks', data: pagedData.map(item => item.overdue) },
            ],
            options: {
                chart: {
                    type: 'bar',
                    height: 400,
                    toolbar: {
                        show: false,
                        tools: { download: true, zoom: true, zoomin: true, zoomout: true, pan: true, reset: true }
                    }
                },
                tooltip: {
                    enabled: true,
                    theme: themeMode,
                    style: {
                        fontSize: '14px',
                        fontFamily: 'Arial, sans-serif',
                        backgroundColor: tooltipBgColor,
                        color: tooltipTextColor,
                    },
                },
                plotOptions: { bar: { horizontal: false, columnWidth: '40%', endingShape: 'rounded' } },
                dataLabels: { enabled: false },
                xaxis: {
                    categories: pagedData.map(item => item.name),
                    labels: { style: { colors: xaxisTitleColor, } },
                    title: {
                        text: 'Technicians',  // Title for x-axis
                        style: {
                            marginTop: '4px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            color: xaxisTitleColor
                        }
                    }
                },
                yaxis: { labels: { style: { colors: xaxisTitleColor } } },
                fill: { opacity: 1 },
                colors: chartColors,
                legend: {
                    position: 'top',
                    horizontalAlign: 'left',
                    verticalAlign: 'middle',
                    fontSize: '14px',
                    fontWeight: 400,
                    itemMargin: {
                        horizontal: 20,
                        vertical: 10
                    },
                    markers: { width: 14, height: 14, radius: 2 },
                    labels: { colors: legendLabelColor }
                },
                grid: { borderColor: gridLineColor, strokeDashArray: 0, xaxis: { lines: { show: false } }, yaxis: { lines: { show: true, strokeWidth: 1, opacity: 0.5 } } },
            },
        });
    }, [themeMode, currentPage]);

    // Handles page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handles rows per page change
    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(Number(event.target.value));
        setCurrentPage(1); // Reset to first page when rows per page change
    };

    return (
        <div className='pc-container'>
            <div className='pc-content'>
                <div className="container">
                    <div className="card shadow-sm">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span className="h4">Task Reports</span>
                            {/* Export Button */}
                            <button className="btn btn-primary">
                                Download Report
                            </button>
                        </div>
                        <div className="card-body">
                            {chartOptions.series && chartOptions.options && (
                                <ApexCharts
                                    options={chartOptions.options}
                                    series={chartOptions.series}
                                    type="bar"
                                    height={400}
                                />
                            )}
                        </div>
                    </div>
                    {/* Pagination Control */}
                    <PaginationControl
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                        rowsPerPage={rowsPerPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default Reports;
