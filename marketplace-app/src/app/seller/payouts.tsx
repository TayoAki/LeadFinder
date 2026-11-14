import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SellerHeader } from '@/components/SellerHeader';
import { Card } from '@/components/ui';
import { money } from '@/lib/data';
import { salesWeek } from '@/lib/sellerData';
import { C, S, T } from '@/lib/theme';

export default function Payouts() {
  const gross = salesWeek.reduce((n, d) => n + d.usd, 0);
  const rows = [['Sales (7 days)', money(gross)], ['Commission (0% intro period)', money(0)], ['Card processing', `−${money(gross * 0.029 + 7 * 0.3)}`]];
  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.dark }}>
      <SellerHeader title="Payouts" back />
      <ScrollView style={{ backgroundColor: C.bg }} contentContainerStyle={{ padding: S.lg, gap: S.md }}>
        <Card>
          <Text style={T.tiny}>NEXT PAYOUT · FRIDAY</Text>
          <Text style={{ fontSize: 34, fontWeight: '900', marginTop: 4 }}>{money(612.4)}</Text>
          <Text style={T.small}>To Chase checking ending 0921</Text>
        </Card>
        <Card>
          {rows.map(([a, b]) => <View key={a} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 }}><Text style={T.small}>{a}</Text><Text style={{ fontWeight: '700' }}>{b}</Text></View>)}
          <Text style={[T.small, { marginTop: 6, color: C.good, fontWeight: '700' }]}>Intro period: 0% commission for 41 more days</Text>
        </Card>
        <Card>
          <Text style={T.h3}>Recent payouts</Text>
          {[['Nov 7', 488.2], ['Oct 31', 351.75], ['Oct 24', 290.1]].map(([d, v]) => <View key={d as string} style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: S.md }}><Text>{d}</Text><Text style={{ fontWeight: '700' }}>{money(v as number)}</Text></View>)}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
