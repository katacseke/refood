import Router from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Button, Card, CardBody, CardFooter, CardTitle } from 'shards-react';
import { IoCall, IoMail, IoAlertCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';

import styles from './shardsReactCard.module.scss';

const ApplicationCard = ({ application }) => {
  const handleApplication = async (status) => {
    const promise = axios.patch(`/api/restaurants/applications/${application.id}`, { status });
    try {
      await toast.promise(
        promise,
        {
          loading: 'Jelentkezés frissítése...',
          success: 'Jelentkezés sikeresen frissítve!',
          error: (err) => err.response.data.error,
        },
        { style: { minWidth: '18rem' } }
      );

      Router.replace('/restaurants/applications');
    } catch (err) {}
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
