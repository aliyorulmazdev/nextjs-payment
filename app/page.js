import Link from 'next/link';

export default function ShoppingPage() {
    return (
        <div>
            <h1>Ürünlerimize Hoş Geldiniz</h1>
            <p>Lütfen aşağıdaki ödeme seçeneklerinden birini seçin:</p>
            <ul>
                <li><Link href="/payment">Kredi Kartıyla Ödeme</Link></li>
            </ul>
        </div>
    );
}
