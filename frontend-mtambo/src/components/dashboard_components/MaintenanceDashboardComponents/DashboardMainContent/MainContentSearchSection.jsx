import React, { useState } from 'react';
import Autosuggest from 'react-autosuggest';

const MainContentSearchSection = ({ onSearch }) => {
    const [searchType, setSearchType] = useState('technician');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Dummy data for suggestions
    const dummySuggestions = {
        technician: ['John Doe', 'Jane Smith', 'Mike Johnson'],
        task: ['Elevator Maintenance', 'Inspection', 'Repair'],
        building: ['Tech Tower', 'Innovation Center', 'Sky Plaza'],
        elevator: ['Elevator 101', 'Elevator 202', 'Elevator 303'],
    };

    const handleSearch = () => {
        onSearch(searchType, searchQuery, dateFilter);
    };

    // Function to handle input change
    const handleInputChange = (event, { newValue }) => {
        setSearchQuery(newValue);
        setIsLoading(true);

        // Simulate async fetch with timeout
        setTimeout(() => {
            setSuggestions(
                dummySuggestions[searchType].filter(item =>
                    item.toLowerCase().includes(newValue.toLowerCase())
                )
            );
            setIsLoading(false);
        }, 300); // Adding a delay for simulating a search
    };

    // Function to handle suggestion selection
    const handleSuggestionSelected = (event, { suggestion }) => {
        setSearchQuery(suggestion);
    };

    // Function to render each suggestion item
    const renderSuggestion = (suggestion) => (
        <div>{suggestion}</div>
    );

    // Get input props for Autosuggest
    const inputProps = {
        placeholder: 'Search...',
        value: searchQuery,
        onChange: handleInputChange,
        'aria-label': 'Search input',
    };

    return (
        <div className="search-section">
            <div className="search-filters">
                {/* Search Type Dropdown */}
                <label htmlFor="searchType">Search By: </label>
                <select
                    id="searchType"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    aria-label="Select Search Type"
                >
                    <option value="technician">Technician</option>
                    <option value="task">Task</option>
                    <option value="building">Building</option>
                    <option value="elevator">Elevator</option>
                </select>

                {/* Autosuggest Input */}
                <div className="autosuggest-wrapper">
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={(e) => handleInputChange(e)}
                        onSuggestionsClearRequested={() => setSuggestions([])}
                        getSuggestionValue={(suggestion) => suggestion}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                        onSuggestionSelected={handleSuggestionSelected}
                    />
                    {isLoading && <div className="loading-spinner">Loading...</div>}
                </div>

                {/* Date Filter (for tasks) */}
                {searchType === 'task' && (
                    <div>
                        <label htmlFor="taskDateFilter">Filter by Date: </label>
                        <input
                            id="taskDateFilter"
                            type="date"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            aria-label="Select Date Filter"
                        />
                    </div>
                )}

                {/* Search Button */}
                <button onClick={handleSearch} className="btn btn-primary">
                    Search
                </button>
            </div>
        </div>
    );
};

export default MainContentSearchSection;