import Koa from 'koa';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import mongoose, { Schema } from 'mongoose';

mongoose.connect('mongodb://fru:devsecret@mongo:27017/fru?authSource=admin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

interface IDonation extends mongoose.Document {
  amount: number;
  currency: string;
}

const donationSchema = new Schema({
  amount: Number,
  currency: String,
});

const Donation = mongoose.model<IDonation>('Donation', donationSchema, 'donations');

const route = /^\/donate\/?$/;

const app = new Koa();

app.use(cors());

app.use(bodyParser());

app.use(async (context) => {
  if (!route.test(context.request.path)) {
    context.response.status = 404;
    return;
  }

  try {
    const { amount, currency } = context.request.body;

    const donation = new Donation({
      amount,
      currency,
    });
    await donation.save();
  } catch (error) {
    context.response.status = 500;
    context.response.message = "Can't save to DB";
    // eslint-disable-next-line no-console
    console.error(error);
  }

  context.body = { ok: true };
});

app.listen(8081);
