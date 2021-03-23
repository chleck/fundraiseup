<template lang="pug">
  q-page.row.items-center.justify-evenly
    .col.col-md-4
      q-card.row.q-pa-lg
        .col-12.col-md-4.q-pa-sm(v-for="value, i in state.presets" :key="i")
          q-btn.full-width(
            :color="value === state.amount ? 'primary' : 'white'"
            :text-color="value === state.amount ? 'white' : 'black'"
            :label="`${state.currency.symbol}${format(value)}`"
            @click="onPresetClick(value)"
          )
        .col-12.q-pa-sm
          q-input(
            outlined
            v-model.number="state.amount"
            mask="############"
            unmasked-value
            :prefix="state.currency.symbol"
          )
            template(v-slot:append)
              q-btn-dropdown(
                flat
                color="white"
                text-color="black"
                :label="state.currency.code"
              )
                q-list
                  q-item(
                    v-for="value in currencies"
                    :key="value.code"
                    clickable
                    v-close-popup
                    @click="onCurrencyChange(value)"
                  )
                    q-item-section
                      q-item-label {{value.name}}
        .col-12.q-pa-sm
          q-btn.full-width(
            color="primary"
            text-color="white"
            label="Donate"
            @click="onDonateClick()"
          )
</template>

<script lang="ts">
import { defineComponent, reactive } from '@vue/composition-api';
import { api } from '../boot/axios';
import { Dialog } from 'quasar';

const presets = [40, 100, 200, 1000, 2500, 5000];

const suggestion = 40;

const currencies = [
	{ name: 'US Dollar', code: 'USD', symbol: '$', rate: 1 },
	{ name: 'Euro', code: 'EUR', symbol: '€', rate: 0.897597 },
	{ name: 'British Pound', code: 'GBP', symbol: '£', rate: 0.81755 },
	{ name: 'Russian Ruble', code: 'RUB', symbol: '₽', rate: 63.461993 },
];

const formatter = new Intl.NumberFormat('en-US');

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const state = reactive({
      amount: suggestion,
      currency: currencies[0],
      presets: presets,
    });

    const pretty = (value: number) => {
      const factor = 10 ** Math.floor(Math.log10(value) / 1.2);
      return Math.round(value / factor) * factor;
    };

    const format = (value: number) => formatter.format(value);

    const onCurrencyChange = (value: typeof currencies[0]) => {
      const i = state.presets.indexOf(state.amount);
      state.presets = presets.map((preset) => pretty(preset * value.rate));
      state.amount = i < 0
        ? Math.round(state.amount / state.currency.rate * value.rate)
        : pretty(presets[i] * value.rate);
      state.currency = value;
    }

    const onPresetClick = (value: number) => {
      state.amount = value / currencies[0].rate;
    }

    const onDonateClick = async () => {
      const query = {
        amount: state.amount,
        currency: state.currency.code,
      };

      try {
        await api.post('/donate', query);
        Dialog.create({
          title: 'Thank you!',
          message: 'Thank you for your donation!',
        });
      } catch (e) {
        console.error('Error:', e);
        Dialog.create({
          title: 'Error',
          message: 'Something went wrong...',
        });
      }
    }

    return {
      format,
      state,
      currencies,
      onCurrencyChange,
      onPresetClick,
      onDonateClick,
    };
  }
});
</script>
