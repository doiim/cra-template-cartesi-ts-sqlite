import React, { useEffect, useState } from 'react';
import { InputBox__factory } from "@cartesi/rollups";
import { Signer, utils } from 'ethers';

import styles from './Lists.module.css';
import { Product } from '../interfaces';


// OBS: change Echo DApp address as appropriate
const DAPP_ADDRESS = process.env.REACT_APP_DAPP_ADDRESS || '0x70ac08179605AF2D9e75782b8DEcDD3c22aA4D0C';
// Standard configuration for local development environment
const INPUTBOX_ADDRESS = process.env.REACT_APP_INPUTBOX_ADDRESS || '0x59b22D57D4f067708AB0c00552767405926dc768';
const QUERY_INSPECT = process.env.REACT_APP_URL_QUERY_INSPECT || "http://localhost:8080/inspect";

export type ListProductsProps = {
    signer: Signer | null;
    noticesLength: number;
};

const ListProducts: React.FC<ListProductsProps> = ({ signer, noticesLength }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (!QUERY_INSPECT) throw new Error('QUERY_INSPECT not set');
                const response = await fetch(`${QUERY_INSPECT}/products`);
                const data = await response.json();
                const list = JSON.parse(utils.toUtf8String(data.reports[0].payload))
                setProducts(list);
            } catch (error: any) {
                console.error(error.message)
            }
        };
        fetchProducts();
    }, [noticesLength]);

    const deleteEntry = async (p: Product) => {
        try {
            if (!DAPP_ADDRESS) throw new Error('DAPP_ADDRESS not set');
            if (!INPUTBOX_ADDRESS) throw new Error('INPUTBOX_ADDRESS not set');
            if (!signer) throw new Error('No Signer addigned to the wallet');
            setStatus(`Removing Product ${p.name}...`);

            // Instantiate the InputBox contract
            const inputBox = InputBox__factory.connect(
                INPUTBOX_ADDRESS,
                signer
            );

            // Encode the input
            const inputBytes = utils.toUtf8Bytes(JSON.stringify({ id: p.id, name: p.name, action: 'delete' }));

            // Send the transaction
            const tx = await inputBox.addInput(DAPP_ADDRESS, inputBytes);
            setStatus('Request sent!');
            // Wait for confirmation
            console.log(`waiting for confirmation... ${tx.hash}`);
            const receipt = await tx.wait(1);
            console.log(`tx confirmed: ${receipt}`);
            setStatus('');
        } catch (error: any) {
            console.error(error.message)
            setStatus('');
        }
    };

    return (
        <div className='w-100'>
            <p><b>Entries List (Inspect)</b></p>
            <table className={styles.products}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {status === '' && products.map((p: Product) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            <td>
                                <button onClick={() => deleteEntry(p)}>✖</button>
                            </td>
                        </tr>
                    ))}
                    {status === '' && products.length === 0 ? (
                        <tr>
                            <td className={styles.faded} colSpan={3}>Products list empty</td>
                        </tr>
                    ) : null}
                    {status !== '' ? (
                        <tr>
                            <td className={styles.faded} colSpan={3}>{status}</td>
                        </tr>
                    ) : null}
                </tbody>
            </table>
        </div>
    );
};

export default ListProducts;
