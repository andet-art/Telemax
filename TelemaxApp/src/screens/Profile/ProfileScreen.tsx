import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { theme } from '../../constants/theme';

export default function ProfileScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  const menuItems = [
    { 
      title: 'My Orders', 
      icon: 'receipt' as const, 
      subtitle: 'Track your purchases',
      onPress: () => Alert.alert('Feature', 'Order history coming soon!')
    },
    { 
      title: 'Wishlist', 
      icon: 'heart' as const, 
      subtitle: 'Save your favorite pipes',
      onPress: () => Alert.alert('Feature', 'Wishlist coming soon!')
    },
    { 
      title: 'Contact Us', 
      icon: 'mail' as const, 
      subtitle: 'Get expert assistance',
      onPress: () => navigation.navigate('Contact')
    },
    { 
      title: 'Settings', 
      icon: 'settings' as const, 
      subtitle: 'App preferences',
      onPress: () => Alert.alert('Feature', 'Settings coming soon!')
    },
    { 
      title: 'Help & Support', 
      icon: 'help-circle' as const, 
      subtitle: 'Get assistance',
      onPress: () => Alert.alert('Support', 'Email us at support@telemax.com or call +1 (555) 123-4567')
    },
    { 
      title: 'About Telemax', 
      icon: 'information-circle' as const, 
      subtitle: 'Our story and craftsmanship',
      onPress: () => Alert.alert('About', 'Telemax has been crafting premium tobacco pipes since 1950. Our master artisans combine traditional techniques with modern innovation to create pipes of exceptional quality.')
    },
  ];

  const stats = [
    { label: 'Orders', value: '3', icon: 'bag' as const },
    { label: 'Wishlist', value: '7', icon: 'heart' as const },
    { label: 'Reviews', value: '2', icon: 'star' as const },
    { label: 'Member Since', value: '2024', icon: 'calendar' as const },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: logout 
        }
      ]
    );
  };

  return (
    <LinearGradient
      colors={theme.gradients.background}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <LinearGradient
            colors={[theme.colors.background.card, theme.colors.background.secondary]}
            style={styles.profileCard}
          >
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                </Text>
              </LinearGradient>
            </View>
            
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            
            <View style={styles.membershipBadge}>
              <LinearGradient
                colors={theme.gradients.primary}
                style={styles.badgeGradient}
              >
                <Ionicons name="diamond" size={16} color={theme.colors.background.primary} />
                <Text style={styles.badgeText}>Premium Member</Text>
              </LinearGradient>
            </View>
          </LinearGradient>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={[theme.colors.background.card, theme.colors.background.secondary]}
            style={styles.statsCard}
          >
            <Text style={styles.statsTitle}>Your Activity</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <Ionicons name={stat.icon} size={20} color={theme.colors.accent.gold} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <LinearGradient
            colors={[theme.colors.background.card, theme.colors.background.secondary]}
            style={styles.menuCard}
          >
            <Text style={styles.menuTitle}>Account & Support</Text>
            
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index < menuItems.length - 1 && styles.menuItemBorder
                ]}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIconContainer}>
                    <Ionicons name={item.icon} size={22} color={theme.colors.accent.gold} />
                  </View>
                  <View style={styles.menuItemText}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color={theme.colors.text.muted} />
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <View style={styles.logoutContent}>
              <Ionicons name="log-out-outline" size={22} color={theme.colors.error} />
              <Text style={styles.logoutText}>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Telemax v1.0.0</Text>
          <Text style={styles.appCopyright}>© 2024 Telemax Tobacco Pipes</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  profileCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  avatarContainer: {
    marginBottom: theme.spacing.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.background.primary,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  userEmail: {
    fontSize: 16,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.lg,
  },
  membershipBadge: {
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
  },
  badgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.background.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  statsCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  menuContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  menuCard: {
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: theme.colors.text.muted,
  },
  logoutContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  logoutButton: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    paddingVertical: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.error + '40',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.error,
  },
  appInfo: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  appVersion: {
    fontSize: 14,
    color: theme.colors.text.muted,
    marginBottom: theme.spacing.xs,
  },
  appCopyright: {
    fontSize: 12,
    color: theme.colors.text.muted,
  },
});
