import React from "react";
import { Typography, Button, Card, CardActions, CardMedia, CardContent } from "@material-ui/core";

import cartItemStyles from "./styles";

const CartItem = ({ item, onRemoveFromCart, onUpdateCartQty }) => {
    const classes = cartItemStyles();
    return (
        <Card>
            <CardMedia image={item.image.url} alt={item.name} className={classes.media} />
            <CardContent className={classes.cardContent}>
                <Typography variant="h4">{item.name}</Typography>
                <Typography variant="h5">{item.line_total.formatted_width_symbol}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <div className={classes.buttons}>
                    <Button type="button" size="small" onClick={() => onUpdateCartQty(item.id, item.quantity - 1)}>
                        -
                    </Button>
                    <Typography>{item.quantity}</Typography>
                    <Button type="button" size="small" onClick={() => onUpdateCartQty(item.id, item.quantity + 1)}>
                        +
                    </Button>
                    <Button variant="contained" type="button" color="secondary" onClick={() => onRemoveFromCart(item.id)}>
                        Remove
                    </Button>
                </div>
            </CardActions>
        </Card>
    );
};

export default CartItem;
