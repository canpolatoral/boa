import { CreditCard } from './validators/credit-card';
import { Email } from './validators/email';
import { IBAN } from './validators/iban';
import { MaxLength } from './validators/max-length';
import { MinLength } from './validators/min-length';
import { Range } from './validators/range';
import { Required } from './validators/required';
import { TaxOrTCKN } from './validators/tax-or-tckn';
import { TaxNumber } from './validators/tax';
import { TCKN } from './validators/tckn';
import { Date } from './validators/date';
import { Regex } from './validators/regex';
import { MinimumRequired } from './validators/group-validators/minimum-required';
import { Condition } from './validators/group-validators/condition';
import { Compare } from './validators/group-validators/compare';


export default {
  CreditCard: new CreditCard(),
  Email: new Email(),
  IBAN: new IBAN(),
  MaxLength: new MaxLength(),
  MinLength: new MinLength(),
  Range: new Range(),
  Required: new Required(),
  TaxOrTCKN: new TaxOrTCKN(),
  TaxNumber: new TaxNumber(),
  TCKN: new TCKN(),
  Date: new Date(),
  Regex: new Regex(),
  MinimumRequired: new MinimumRequired(),
  Condition: new Condition(),
  Compare: new Compare()
};
