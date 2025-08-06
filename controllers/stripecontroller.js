const Stripe = require('stripe');
const stripe = new Stripe('');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()
const uuidv4 = require('uuid').v4;
module.exports={

    //createAccounjt
    createAccount:async function createAccount(data) {
        try {
            const account = await stripe.accounts.create({
                type: 'express', // or 'standard' based on your needs
                country: 'US', // or the country of the driver
                email: data.email, // email of the driver
                capabilities: {
                    card_payments: { requested: true },
                    transfers: { requested: true },
                },
            });
    
            // Send account link for onboarding
            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: 'https://yourapp.com/reauth',
                return_url: 'https://yourapp.com/success',
                type: 'account_onboarding',
            });
            console.log("accountLink",accountLink)
           return { url: accountLink.url };
        } catch (error) {
            console.log("Er",error)
            throw error
        }
    },
//Create Intent of stripe
createIntentStripe:async function createIntentStripe(data) {
    try {
        const customer = await stripe.customers.create({
            email:data.email  
        });
        const ephemeralKey = await stripe.ephemeralKeys.create(
            {customer: customer?.id},
            {apiVersion: '2024-04-10'}
        )

        const paymentIntent = await stripe.paymentIntents.create({
            customer: customer.id,
            receipt_email:data.email,
            amount: data.amount,
            currency: "usd",
            automatic_payment_methods: {
              enabled: true,
            },
        }).catch((err) => { console.log(err) });
        return {
            paymentIntent: paymentIntent?.client_secret,
            ephemeralKey: ephemeralKey?.secret,
            customer: customer.id,
          }
    } catch (error) {
        throw error
    }
},


createPayOutStripe:async function createPayOutStripe(data) {
    try {
        const balance = await stripe.balance.retrieve();
        console.log(balance);
        const payout = await stripe.payouts.create({
            amount:data.amount,
            currency:"usd",
        });
        return payout
    } catch (error) {
        throw error
    }
},

saveCard:async function saveCard(data) {
    try {
        const check = await prisma.savecard.findUnique({
            where:{cardnumber:data.cardnumber}
        })
        if(check){
            throw "Sorry this card already added"
        }
        const uuid = uuidv4()
        const createSave = await prisma.savecard.create({
            data:{
                uuid:uuid,
                userId:data.userId,
                cardnumber:data.cardnumber,
                cardexp:data.cardexp,
                cardToken:data.cardToken
            }
        })
        return createSave

    } catch (error) {
        throw error
    }
},

getsaveCard:async function getsaveCard(data) {
    try {
        const check = await prisma.savecard.findMany({
            where:{userId:data.userId}
        })
        return check

    } catch (error) {
        throw error
    }
}

}