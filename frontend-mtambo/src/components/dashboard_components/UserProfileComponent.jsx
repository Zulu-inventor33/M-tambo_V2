import React from 'react';
import { Container, Row, Col, Card, ListGroup, ListGroupItem, Badge } from 'react-bootstrap';

const UserProfileComponent = ({ user }) => {
    return (
        <Container fluid className="my-2">
            <Row>
                {/* Left Column - Profile Overview of Technicican*/}
                <Col xs={12} sm={5} md={4} xl={5} className="mb-4">
                    <Card>
                        <Card.Body className='card-user-profile-body'>
                            {/* Status Badge */}
                            <Badge variant="alert" className="mb-3">Scheduled</Badge>

                            {/* Profile Image and Info */}
                            <Row className="">
                                <Col xs={12} className="text-center">
                                    <img
                                        src="/images/avatar_placeholder.png"
                                        alt="Avatar"
                                        className="rounded-circle"
                                        width="100"
                                    />
                                </Col>
                                <Col xs={12} className="text-center">
                                    <h5 className="mt-2">Eliza Herrmann</h5>
                                    <p className="text-muted">Technician</p>
                                </Col>
                            </Row>
                            {/* Contact Info */}
                            <ListGroup variant="flush">
                                <ListGroupItem className="d-flex justify-content-between">
                                    <span>Email</span>
                                    <span>simjop@gmail.com</span>
                                </ListGroupItem>
                                <ListGroupItem className="d-flex justify-content-between">
                                    <span>Phone</span>
                                    <span>+254 758 492 438</span>
                                </ListGroupItem>
                                <ListGroupItem className="d-flex justify-content-between">
                                    <span>Location</span>
                                    <span>Nairobi County</span>
                                </ListGroupItem>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right Column - Personal Details of the Technicians */}
                <Col xs={12} sm={7} md={8} xl={7} className="mb-4">
                    <Card>
                        <Card.Header>
                            <h5>Technicians Details</h5>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroupItem>
                                    <Row>
                                        <Col sm={6}>
                                            <strong>Full Name</strong>
                                            <p>Eliza Herrmann</p>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <Row>
                                        <Col sm={6}>
                                            <strong>County</strong>
                                            <p>Nairobi</p>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                                <ListGroupItem>
                                    <strong>Location</strong>
                                    <p>Imaara Daima</p>
                                </ListGroupItem>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default UserProfileComponent;
