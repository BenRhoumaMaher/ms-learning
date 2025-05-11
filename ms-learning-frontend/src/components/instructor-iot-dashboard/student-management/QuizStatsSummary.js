import { FaChartLine } from 'react-icons/fa';
import { Card } from 'react-bootstrap';
import { QuizPerformanceChart } from './QuizPerformanceChart';

export const QuizStatsSummary = ({ quizStats }) => {
    return (
        <Card className="mb-4 shadow-sm">
            <Card.Header className="d-flex align-items-center">
                <FaChartLine className="me-2" />
                <span className="fw-bold">Quiz Performance Statistics</span>
            </Card.Header>
            <Card.Body>
                <div className="row">
                    <div className="col-md-8">
                        <QuizPerformanceChart quizStats={quizStats} />
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex flex-column h-100 justify-content-center">
                            <div className="mb-3">
                                <h5>Summary</h5>
                                <ul className="list-group">
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Total Attempts:
                                        <span className="badge bg-primary rounded-pill">
                                            {quizStats.count}
                                        </span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Average Score:
                                        <span className="badge bg-info rounded-pill">
                                            {quizStats.average.toFixed(1)}%
                                        </span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Highest Score:
                                        <span className="badge bg-success rounded-pill">
                                            {quizStats.max}%
                                        </span>
                                    </li>
                                    <li className="list-group-item d-flex justify-content-between align-items-center">
                                        Lowest Score:
                                        <span className="badge bg-danger rounded-pill">
                                            {quizStats.min}%
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};