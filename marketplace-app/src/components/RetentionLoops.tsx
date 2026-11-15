// Retention loops (conversion plan §4 Phase 3), run once the catalogue is loaded:
// - back-in-stock: tell the shopper the moment a watched item returns, then clear the alert;
// - replenishment: when a reorder reminder is due, offer one-tap reorder and schedule the next.
// On phones, both also schedule local notifications (when the shopper allowed them).
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { track } from '@/lib/analytics';
import { getProduct } from '@/lib/data';
import { inHoldout } from '@/lib/experiments';
import { toast } from '@/lib/feedback';
import { useStore } from '@/lib/store';

export function RetentionLoops() {
  const { stockAlerts, toggleStockAlert, replenish, setReplenish, add, notif } = useStore();
  const ran = useRef(false);
  useEffect(() => {
    if (ran.current) return; ran.current = true;
    const t = setTimeout(() => {
      for (const id of stockAlerts) {
        const p = getProduct(id);
        if (p && p.stock > 0) {
          track('back_in_stock_seen', { product_id: id });
          toast({ text: `${p.title} is back in stock`, icon: 'notifications', action: { label: 'View', onPress: () => router.push(`/product/${id}`) } });
          toggleStockAlert(id); // clears the alert
          break; // one message at a time
        }
      }
      const due = replenish.find(r => r.next <= Date.now() && getProduct(r.productId)?.stock);
      if (due) {
        const p = getProduct(due.productId);
        track('replenish_due', { product_id: due.productId, days: due.days });
        toast({ text: `Running low on ${p.title}?`, icon: 'repeat', action: { label: 'Reorder', onPress: () => { track('replenish_reorder', { product_id: p.id }); add(p, due.size, 1); router.push('/cart'); } } });
        setReplenish(due.productId, due.size, due.days); // schedules the next one
      }
    }, 1500);
    return () => clearTimeout(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Phones: mirror reminders as local notifications (never for the push holdout).
  useEffect(() => {
    if (Platform.OS === 'web' || notif !== 'granted' || inHoldout('holdout_push')) return;
    (async () => {
      await Notifications.cancelAllScheduledNotificationsAsync();
      for (const r of replenish) {
        const p = getProduct(r.productId); if (!p) continue;
        await Notifications.scheduleNotificationAsync({
          content: { title: `Time to reorder ${p.title}?`, body: 'Tap to add it to your cart.', data: { url: `/product/${p.id}` } },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(r.next) },
        });
      }
    })().catch(() => {});
  }, [replenish, notif]);
  return null;
}
