"""US buyer counts from Census County Business Patterns 2022 (establishments, all legal forms).
Source file: https://www2.census.gov/programs-surveys/cbp/datasets/2022/cbp22us.zip
Band counts (e.g. 5-49 employees) come from the all-industries row.
Run: python3 census_buyers.py <path to cbp22us.txt>  -> buyers_census.json
"""
import csv, json, sys
rows = {r['naics']: r for r in csv.DictReader(open(sys.argv[1])) if r['lfo'] == '-'}
def est(c):
    if c in ('44-45', '31-33', '48-49'): k = c[:2] + '----'
    else: k = c + {2: '----', 3: '///', 4: '//', 5: '/', 6: ''}[len(c)]
    return int(rows[k]['est'])
T = rows['------']
def band(*bs): return sum(int(T['n' + b]) for b in bs)
SMB5_49 = ('5_9', '10_19', '20_49'); B20_499 = ('20_49', '50_99', '100_249', '250_499'); B100_999 = ('100_249', '250_499', '500_999')
M = {  # id: (naics codes or band, label)
 1: (['7225'], 'restaurants and other eating places'), 2: (['7225'], 'restaurants'), 12: (['7225', '722320'], 'restaurants + caterers'),
 3: (['238220', '238210', '238160', '238320', '561730'], 'plumbing/HVAC, electrical, roofing, painting, landscaping'),
 4: (['621210'], 'dental offices'), 5: (['81211'], 'hair, nail and skin care'), 6: (['5416'], 'management/technical consulting'),
 8: (['524210', '541110'], 'insurance agencies + law offices'), 9: (['5418', '541430'], 'advertising/PR + graphic design'),
 10: (['7113'], 'event promoters'), 11: (['7113', '561920'], 'promoters + convention/trade-show organisers'),
 13: (['454110'], 'online retailers'), 19: (['454110'], 'online retailers'), 25: (['454110'], 'online retailers'),
 48: (['454110'], 'online retailers'), 95: (['454110'], 'online retailers'), 96: (['454110'], 'online retailers'),
 14: (['541512', '541513', '541519'], 'IT services firms (MSP proxy)'), 36: (['541512', '541513', '541519'], 'IT services firms (MSP proxy)'),
 37: (['541512', '541513', '541519'], 'IT services firms (MSP proxy)'), 38: (['541512', '541513', '541519'], 'IT services firms (MSP proxy)'),
 39: (['541512', '541513', '541519'], 'IT services firms (MSP proxy)'),
 16: (['5418', '531210'], 'ad agencies + real estate brokerages'), 17: (['524210'], 'insurance agencies'), 100: (['524210'], 'insurance agencies'),
 22: (['541511'], 'custom software/web dev firms'), 23: (['541511'], 'custom software/web dev firms'), 127: (['541511'], 'custom software/web dev firms'),
 47: (['541511', '541430'], 'web dev + design firms'), 128: (['541511', '541430'], 'web dev + design firms'),
 24: (['42'], 'merchant wholesalers'), 27: (['511210'], 'software publishers'), 45: (['511210'], 'software publishers'),
 73: (['511210'], 'software publishers'), 129: (['511210'], 'software publishers'),
 130: (['541511', '511210'], 'web dev firms + software publishers'), 131: (['511210', '541511'], 'software publishers + dev firms'),
 132: (['511210', '541511'], 'software publishers + dev firms'), 77: (['511210', '454110'], 'software publishers + online retailers'),
 30: (['31-33'], 'manufacturing establishments'), 72: (['31-33'], 'manufacturing establishments'),
 34: (['23'], 'construction establishments'), 106: (['236', '237', '541330'], 'construction + engineering firms'),
 35: (['6111'], 'private K-12 schools'), 63: (['6111'], 'private K-12 schools'),
 49: (['541110', '6211'], 'law offices + physician offices'), 50: (['5412'], 'accounting/tax/bookkeeping firms'),
 51: (['541110', '5412'], 'law + accounting firms'), 85: (['541110', '5412'], 'law + accounting firms'),
 53: (['524210', '522310'], 'insurance agencies + mortgage brokers'), 54: (['541110'], 'law offices'), 86: (['541110'], 'law offices'),
 55: (['6211'], 'physician offices'), 88: (['541110', '6211'], 'law + physician offices'),
 58: (['81391', '81392', '6113'], 'business/professional associations + colleges'), 60: (['813110'], 'religious organisations'),
 61: (['8132', '8133', '8134'], 'grantmaking, social advocacy and civic orgs'), 64: (['531110'], 'lessors of residential buildings'),
 65: (['721110', '721191'], 'hotels/motels + B&Bs'), 66: (['484', '4922'], 'trucking + local couriers'), 67: (['4922'], 'local couriers and messengers'),
 68: (['7225', '4451'], 'restaurants + grocery stores'), 70: (['7225', '446110'], 'restaurants + pharmacies'),
 74: (['622'], 'hospitals'), 75: (['5418', '541511'], 'ad agencies + web dev firms'), 97: (['541921', '323111'], 'photography studios + commercial printers'),
 98: (['531210'], 'real estate brokerages'), 104: (['541430'], 'graphic design firms'), 105: (['5418', '541511'], 'ad agencies + dev firms'),
 112: (['621330', '621112'], 'mental-health practitioners + psychiatrists'), 113: (['611691'], 'tutoring and exam prep'),
 114: (['541921'], 'photography studios'), 121: (['523930'], 'investment advice firms'), 133: (['522130', '522291'], 'credit unions + consumer lenders'),
 134: (['541380'], 'testing laboratories'), 135: (['713940'], 'fitness centres'), 136: (['44-45'], 'retail establishments'),
 137: (['561320'], 'temporary staffing agencies'), 141: (['541910', '6113'], 'market research firms + colleges'), 142: (['523110'], 'investment banking'),
 144: (['5418'], 'advertising/PR agencies'),
}
SMB = [7, 15, 18, 21, 29, 31, 32, 46, 81, 82, 83, 84, 87, 116, 117, 118, 120, 125, 126, 138, 140, 145, 148, 149]
MID = [42, 43, 44, 40, 52, 78, 102, 107, 108, 143, 146]
BIG = [33, 57, 80, 119, 123, 124, 79, 41, 110, 111]
out = {}
for i, (codes, label) in M.items():
    out[str(i)] = {'count': sum(est(c) for c in codes), 'basis': f'Census CBP 2022: {label} ({"+".join(codes)})'}
for i in SMB: out[str(i)] = {'count': band(*SMB5_49), 'basis': 'Census CBP 2022: establishments with 5-49 employees (all industries)'}
for i in MID: out[str(i)] = {'count': band(*B20_499), 'basis': 'Census CBP 2022: establishments with 20-499 employees (all industries)'}
for i in BIG: out[str(i)] = {'count': band(*B100_999), 'basis': 'Census CBP 2022: establishments with 100-999 employees (all industries)'}
json.dump(out, open('buyers_census.json', 'w'), indent=1)
print(len(out), 'rows mapped')
