import { Button, Card, CardBody, CardFooter, CardTitle } from 'shards-react';
import { IoCall, IoMail, IoAlertCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import Router from 'next/router';
import styles from './applicationCard.module.scss';

const ApplicationCard = ({ application }) => {
  const handleApplication = async (status) => {
    const res = await fetch(`/api/restaurants/applications/${application.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.log(err.message);

      return;
    }

    Router.push('/restaurants/applications');
  };
  return (
    <Card className={styles.card}>
      <CardBody>
        <CardTitle>{application.name}</CardTitle>

        <ul className={styles.moreInformation}>
          <li>
            <IoCall className="mr-1" /> {application.phone}
          </li>
          <li>
            <IoMail className="mr-1" /> {application.email}
          </li>
        </ul>

        <p className={styles.description}>{application.description}</p>
      </CardBody>

      <CardFooter className={styles.footer}>
        {application.status === 'pending' && (
          <>
            <Button
              active
              theme="success"
              onClick={() => handleApplication('accepted')}
              className={styles.button}
            >
              <IoCheckmarkCircleOutline className="mr-1" /> Elfogad
            </Button>

            <Button
              active
              theme="danger"
              onClick={() => handleApplication('denied')}
              className={styles.button}
            >
              <IoAlertCircleOutline className="mr-1" /> Elutasít
            </Button>
          </>
        )}
        {application.status === 'accepted' && (
          <p className="text-success my-2 text-center flex-grow-1">
            <IoCheckmarkCircleOutline className="mr-1" /> Elfogadva
          </p>
        )}
        {application.status === 'registered' && (
          <p className="text-success my-2 text-center flex-grow-1">
            <IoCheckmarkCircleOutline className="mr-1" /> Regisztrálva
          </p>
        )}
        {application.status === 'denied' && (
          <p className="text-danger my-2 text-center flex-grow-1">
            <IoAlertCircleOutline className="mr-1" /> Elutasítva
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
