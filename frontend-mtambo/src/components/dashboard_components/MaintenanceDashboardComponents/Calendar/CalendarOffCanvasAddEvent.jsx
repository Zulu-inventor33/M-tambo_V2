import React from 'react';

const CalendarOffcanvas = ({ showOffcanvas, toggleOffcanvas }) => {
    return (
        <div>
            <div
                className={`offcanvas offcanvas-end ${showOffcanvas ? 'show' : ''}`}
                tabIndex="-1"
                id="offcanvas_pc_layout"
                aria-labelledby="offcanvas_pc_layout_label"
                style={{ visibility: showOffcanvas ? 'visible' : 'hidden' }}
            >
                <div className="offcanvas-header bg-primary text-white">
                    <h5 className="offcanvas-title" id="offcanvas_pc_layout_label">Add Event</h5>
                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        onClick={toggleOffcanvas}
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    {/* Event Form */}
                    <form autocomplete="off">
                        <div className="mb-3">
                            <label htmlFor="eventTitle" className="form-label">Title</label>
                            <input type="text" className="form-control" id="eventTitle" placeholder="Event Title" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="eventCalendar" className="form-label">Calendar</label>
                            <select className="form-select" id="eventCalendar">
                                <option value="business">Business</option>
                                <option value="personal">Personal</option>
                            </select>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="eventStartDate" className="form-label">Start Date</label>
                            <input type="date" className="form-control" id="eventStartDate" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="eventEndDate" className="form-label">End Date</label>
                            <input type="date" className="form-control" id="eventEndDate" />
                        </div>

                        <div className="mb-3 form-check form-switch">
                            <input className="form-check-input" type="checkbox" id="allDaySwitch" />
                            <label className="form-check-label" htmlFor="allDaySwitch">All Day</label>
                        </div>

                        <div className="mb-3">
                            <label htmlFor="eventUrl" className="form-label">Event URL</label>
                            <input type="url" className="form-control" id="eventUrl" placeholder="https://example.com" />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="eventDescription" className="form-label">Description</label>
                            <textarea className="form-control" id="eventDescription" rows="4" placeholder="Describe your event..."></textarea>
                        </div>

                        <div className="d-flex gap-3">
                            <button type="submit" className="btn btn-primary">Add Event</button>
                            <button type="reset" className="btn btn-secondary">Reset</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CalendarOffcanvas;