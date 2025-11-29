import re

# Read the file
with open('App.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and replace the useEffect that handles user login
old_effect = """  useEffect(() => {
    if (user) {
      if (pendingCartOpen) {
        setIsCartOpen(true);
        setPendingCartOpen(false);
      }

      if (isAdmin && !isAdminViewInitialized) {
        setView('dashboard');
        setIsAdminViewInitialized(true);
      } else if (isTransporter) {
        setView('transporter_dashboard');
      } else if (isCustomer) {
        setView('orders');
      }
    } else {
      // Reset if user logs out
      setView('catalog');
      setIsAdminViewInitialized(false);
    }
  }, [user, isAdmin, isCustomer, isTransporter, isAdminViewInitialized, pendingCartOpen]);"""

new_effect = """  useEffect(() => {
    if (user) {
      if (pendingCartOpen) {
        setIsCartOpen(true);
        setPendingCartOpen(false);
      }

      if (isAdmin && !isAdminViewInitialized) {
        setView('dashboard');
        setIsAdminViewInitialized(true);
        window.scrollTo(0, 0); // Scroll to top when admin logs in
      } else if (isTransporter) {
        setView('transporter_dashboard');
        window.scrollTo(0, 0); // Scroll to top when transporter logs in
      } else if (isCustomer) {
        setView('orders');
        window.scrollTo(0, 0); // Scroll to top when customer logs in
      }
    } else {
      // Reset if user logs out
      setView('catalog');
      setIsAdminViewInitialized(false);
    }
  }, [user, isAdmin, isCustomer, isTransporter, isAdminViewInitialized, pendingCartOpen]);"""

content = content.replace(old_effect, new_effect)

# Write the corrected content
with open('App.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Added scroll to top on login!")
