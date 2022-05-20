import { GetServerSideProps } from 'next';

const Home = () => {
  return (
    <div>
      <h1>Hello world</h1>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    return {
      props: {},
    };
  } catch (error) {
    return {
      props: {},
    };
  }
};

export default Home;
