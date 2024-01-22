import React from 'react';
import styles from './Lists.module.css';
import { ProductAction } from '../interfaces';

type ListProductsProps = {
    notices: ProductAction[];
};

const ListProducts: React.FC<ListProductsProps> = ({ notices }) => {

    return (
        <div className="w-100">
            <p><b>Logs (Notices)</b></p>
            <table className={styles.notices}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {notices.map((p: ProductAction) => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.name}</td>
                            {p.action === 'add' ? <td className={styles.green}>{p.action}</td> : null}
                            {p.action === 'delete' ? <td className={styles.red}>{p.action}</td> : null}
                        </tr>
                    ))}
                    {notices.length === 0 ? (
                        <tr>
                            <td className={styles.faded} colSpan={3}>Notices list empty</td>
                        </tr>
                    ) : null}
                </tbody>
            </table>
        </div>
    );
};

export default ListProducts;
