// Copyright(C) 2020 Tetsuki Syu
// See bot.ts for the full notice.

export const LOOKUP_LENGTH = {
  km: {
    km: 1,
    m: 0.001,
    cm: 1e-5,
    in: 2.54e-5,
    ft: 0.0003048,
    mi: 1.60934,
    au: 1.496e+8,
  },
  m: {
    km: 1000,
    m: 1,
    cm: 0.01,
    in: 0.0254,
    ft: 0.3048,
    mi: 1609.34,
    au: 1.496e+11,
  },
  cm: {
    km: 100000,
    m: 100,
    cm: 1,
    in: 2.54,
    ft: 30.48,
    mi: 160934,
    au: 1.496e+13,
  },
  in: {
    km: 39370.1,
    m: 39.3701,
    cm: 0.393701,
    in: 1,
    ft: 12,
    mi: 63360,
    au: 5.89e+12,
  },
  ft: {
    km: 3280.84,
    m: 3.28084,
    cm: 0.0328084,
    in: 0.0833333,
    ft: 1,
    mi: 5280,
    au: 4.908e+11,
  },
  mi: {
    km: 0.621371,
    m: 0.000621371,
    cm: 6.21371e-6,
    in: 1.57828e-5,
    ft: 0.000189394,
    mi: 1,
    au: 9.296e+7,
  },
  au: {
    km: 6.68459e-9,
    m: 6.68459e-12,
    cm: 6.68459e-14,
    in: 1.69789e-13,
    ft: 2.03746e-12,
    mi: 1.07578e-8,
    au: 1,
  },
};

export const LOOKUP_TEMPERATURE = {
  c: {
    c: 1,
    f: 5 / 9,
    k: 1,
  },
  f: {
    c: 9 / 5,
    f: 1,
    k: 9 / 5,
  },
  k: {
    c: 1,
    f: 5 / 9,
    k: 1,
  },
};