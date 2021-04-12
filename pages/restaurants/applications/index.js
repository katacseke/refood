import { Container, FormSelect, Button, Row, Col } from 'shards-react';
import { applicationService } from '../../../server/services';
import Layout from '../../../components/layout';
import ApplicationCard from '../../../components/applicationCard';
import styles from './applications.module.scss';

const ApplicationsPage = ({ applications }) => {
  const handleFiltering = () => {};

  return (
    <Layout>
      <h1 className={styles.title}>Vendéglő jelentkezések</h1>
      <Container>
        <Row>
          <Col>
            <FormSelect name="filterStatus">
              <option value="pending">Függőben</option>
              <option value="accepted">Elfogadva</option>
              <option value="denied">Elutasítva</option>
            </FormSelect>
          </Col>
          <Col>
            <Button onClick={() => handleFiltering()}>Szűrés</Button>
          </Col>
        </Row>
      </Container>
      <Container className="m-0 p-0 d-flex flex-wrap w-100 justify-content-center">
        {applications.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
      </Container>
    </Layout>
  );
};

export default ApplicationsPage;

export async function getStaticProps() {
  const applications = await applicationService.getApplications();

  return {
    props: {
      applications: JSON.parse(JSON.stringify(applications.data)),
    },
  };
}
