import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, FormSelect, Button, Row, Col } from 'shards-react';

import applicationService from '@services/applicationService';

import Layout from '@components/layout';
import ApplicationCard from '@components/cards/applicationCard';
import styles from './applications.module.scss';

const ApplicationsPage = ({ applications }) => {
  const { query } = useRouter();
  const [status, setStatus] = useState(query.status);

  return (
    <Layout>
      <h1 className={styles.title}>Vendéglő jelentkezések</h1>
      <Container>
        <Row>
          <Col>
            <FormSelect
              name="filterStatus"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Összes</option>
              <option value="pending">Függőben</option>
              <option value="accepted">Elfogadva</option>
              <option value="denied">Elutasítva</option>
              <option value="registered">Regisztrálva</option>
            </FormSelect>
          </Col>
          <Col>
            <Link href={`/restaurants/applications?status=${status}`}>
              <Button as="a">Szűrés</Button>
            </Link>
          </Col>
        </Row>
      </Container>
      <Container className="m-0 p-0 d-flex flex-wrap w-100 justify-content-center">
        {applications.map((application) => (
          <ApplicationCard key={application.id} application={application} />
        ))}
        {applications.length === 0 && (
          <p className="text-muted mt-3">Nem találhatók a feltételnek megfelelő jelentkezések.</p>
        )}
      </Container>
    </Layout>
  );
};

export default ApplicationsPage;

export async function getServerSideProps({ query }) {
  const applications = await applicationService.getApplications(query.status);
  applications.sort((a, b) => {
    if (a.status === 'pending') {
      return -1;
    }
    if (b.status === 'pending') {
      return 1;
    }
    return 0;
  });

  return {
    props: {
      applications: JSON.parse(JSON.stringify(applications)),
    },
  };
}
