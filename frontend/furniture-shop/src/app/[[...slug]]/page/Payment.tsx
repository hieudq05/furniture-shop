import NavUser from "../components/NavUser";
import OrderProduct from "../components/OrderProduct";
import { PaymentForm } from "../components/PayForm";
import styles from "../../style/Home.module.css";

function Payment() {
    return (
        <div className={`${styles.home} flex`}>
            <div className="w-full flex justify-center">
                <div className="grid md:grid-cols-2 grid-cols-1 gap-4 2xl:max-w-8xl">
                    <OrderProduct />
                    <PaymentForm />
                </div>
            </div>
        </div>
    );
}
export default Payment;
