import React, { useEffect, useState } from 'react';
import { Signer, utils } from 'ethers';

import { useQuery, gql } from "@apollo/client";

import LogoCartesi from './components/logos/LogoCartesi';
import LogoDoiim from './components/logos/LogoDoiim';
import WalletConnector from './components/WalletConnector';
import CreateProductForm from './components/CreateProductForm';
import ListProducts from './components/ListProducts';
import ListNotices from './components/ListNotices';

import './App.css';

// GraphQL query to retrieve notices given a cursor
const GET_NOTICES = gql`
query GetNotices($cursor: String) {
    notices(first: 10, after: $cursor) {
        totalCount
        pageInfo {
            hasNextPage
            endCursor
        }
        edges {
            node {
                index
                payload
            }
        }
    }
}`;

const App = () => {

  const [signer, setSigner] = React.useState<Signer | null>(null);
  const [notices, setNotices] = useState([]);
  const [cursor, setCursor] = useState(null);

  // Retrieve notices every 500 ms
  const { data } = useQuery(GET_NOTICES, {
    variables: { cursor },
    pollInterval: 2000,
  });

  useEffect(() => {
    // Check query result
    const length = data?.notices?.edges?.length;
    if (length) {
      // Update cursor so that next GraphQL poll retrieves only newer data
      setCursor(data.notices.pageInfo.endCursor);
    }
    // Render new echoes
    const newNotices = data?.notices?.edges?.map(({ node }: { node: any }) => {
      // Render echo from notice
      const entry = JSON.parse(utils.toUtf8String(node.payload));
      console.log(`Detected new entry : ${JSON.stringify(entry)} `);
      return entry;
    });
    if (newNotices) {
      // Concat new echoes with previous ones
      setNotices((prev) => {
        return prev.concat(newNotices);
      });
    }
  }, [data]);

  const onSignerChange = async (s: Signer | null) => {
    setSigner(s);
  }

  return (
    <div className="app">
      <WalletConnector onSignerChange={onSignerChange} />
      <header className="header">
        <h1>Cartesi + React + SQLite</h1>
        <p>This project is designed to streamline the process of kickstarting new projects. It incorporates React + Typescript, integrates with Ethers and communicates to a SQLite database running on Cartesi Machine.</p>
        {!signer ? <p>Connect your wallet to be able to Add/Remove products from database.</p> : null}
      </header>
      {signer ? <main>
        <CreateProductForm signer={signer}></CreateProductForm>
        <div className="holder">
          <div className='flex-row'>
            <ListProducts signer={signer} noticesLength={notices.length}></ListProducts>
            <ListNotices notices={notices}></ListNotices>
          </div>
        </div>
      </main>
        : null}
      <footer>
        <p>powered by</p>
        <LogoCartesi />
        <LogoDoiim />
      </footer>
    </div>
  );
};

export default App;
