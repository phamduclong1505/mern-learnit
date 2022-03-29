import Button from "react-bootstrap/esm/Button"
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const About = () => {
    return (
        <Row className="mt-5">
            <Col className="text-center">
                <Button variant="primary" href="https://translate.google.com/?hl=vi&sl=en&tl=vi&op=translate" size="lg">
                    Visit my channel for more tutorials
                </Button>
            </Col>
        </Row>
    )
}

export default About