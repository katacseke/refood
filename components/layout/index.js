import Head from 'next/head';
import NavBar from '../navBar';
import styles from './layout.module.scss';

const Layout = ({ children }) => (
  <>
    <NavBar />
    <div className={styles.container}>
      <Head>
        <title>Project</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>{children}</main>

      <footer className={styles.footer} />
    </div>
  </>
);

export default Layout;
