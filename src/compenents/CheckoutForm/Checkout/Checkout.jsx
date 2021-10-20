import React, { useState, useEffect } from "react";
import { Paper, Stepper, Step, StepLabel, Typography, Divider, Button, CircularProgress, CssBaseline } from "@material-ui/core";
import checkoutStyles from "./styles";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import { commerce } from "../../../lib/commerce";
import { Link, useHistory } from "react-router-dom";

const steps = ["Shipping Address", "Payment Details"];

const Checkout = ({ cart, order, onCaptureCheckout, error }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [checkoutToken, setCheckoutToken] = useState(null);
    const [shippingData, setShippingData] = useState({});
    const history = useHistory();
    const [isFinished, setIsFinished] = useState(false);
    const classes = checkoutStyles();

    useEffect(() => {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: "cart" });
                setCheckoutToken(token);
            } catch (error) {
                history.pushState("/");
            }
        };
        generateToken();
    }, [cart]);

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1);
    const next = (data) => {
        setShippingData(data);
        nextStep();
    };

    const timeOut = () => {
        setTimeout(() => {
            setIsFinished(true);
        }, 3000);
    };

    const Form = () =>
        activeStep === 0 ? (
            <AddressForm checkoutToken={checkoutToken} next={next} />
        ) : (
            <PaymentForm
                shippingData={shippingData}
                checkoutToken={checkoutToken}
                backStep={backStep}
                onCaptureCheckout={onCaptureCheckout}
                nextStep={nextStep}
                timeOut={timeOut}
            />
        );
    let Confirmation = () =>
        order.customer ? (
            <>
                <div>
                    <Typography variant="h5">
                        Thankyou for your Purchase, {order.customer.firstname} {order.customer.lastname}
                    </Typography>
                    <Divider className={classes.divider}></Divider>
                    <Typography variant="subtitle2">Order Ref: {order.customer_reference}</Typography>
                </div>
                <br />
                <Button component={Link} to="/" variant="outlined" type="button">
                    Back to Home
                </Button>
            </>
        ) : isFinished ? (
            <>
                <div>
                    <Typography variant="h5">Thankyou for your Purchase</Typography>
                    <Divider className={classes.divider}></Divider>
                </div>
                <br />
                <Button component={Link} to="/" variant="outlined" type="button">
                    Back to Home
                </Button>
            </>
        ) : (
            <div className={classes.spinner}>
                <CircularProgress />
                <br />
            </div>
        );

    if (error) {
        <>
            <Typography variant="h5"> Error : {error}</Typography>
        </>;
    }

    return (
        <>
            <CssBaseline />
            <div className={classes.toolbar}></div>
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">
                        Checkout
                    </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
                </Paper>
            </main>
        </>
    );
};

export default Checkout;
