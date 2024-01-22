import React, { useState } from 'react';
import { Signer, utils } from 'ethers';
import { InputBox__factory } from "@cartesi/rollups";

import styles from './CreateProductForm.module.css';

// OBS: change Echo DApp address as appropriate
const DAPP_ADDRESS = process.env.REACT_APP_DAPP_ADDRESS;
// Standard configuration for local development environment
const INPUTBOX_ADDRESS = process.env.REACT_APP_INPUTBOX_ADDRESS;

type ListTablesProps = {
    signer: Signer | null;
};

const CreateProduct: React.FC<ListTablesProps> = ({ signer }) => {
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            if (!DAPP_ADDRESS) throw new Error('DAPP_ADDRESS not set');
            if (!INPUTBOX_ADDRESS) throw new Error('INPUTBOX_ADDRESS not set');
            if (!signer) throw new Error('No Signer addigned to the wallet');
            setStatus('Sending ...');

            // Instantiate the InputBox contract
            const inputBox = InputBox__factory.connect(
                INPUTBOX_ADDRESS,
                signer
            );

            // Encode the input
            const inputBytes = utils.toUtf8Bytes(JSON.stringify({ id, name, action: 'add' }));

            // Send the transaction
            const tx = await inputBox.addInput(DAPP_ADDRESS, inputBytes);
            setStatus('Sent!');
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
        <div className='holder'>
            <p><b>Insert New Product</b></p>
            <form className={styles.formContainer} onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        id="id"
                        placeholder='Product ID'
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="text"
                        id="name"
                        placeholder='Product Name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={status !== ''} onClick={handleSubmit}>
                    {status !== '' ? status : 'Submit'}
                </button>
            </form>
        </div >
    );
};

export default CreateProduct;
