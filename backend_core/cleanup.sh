
#!/bin/bash
# Noor Official V3 - Infrastructure Purification Script
# Role: QA Lead / Architect

echo "🚀 Starting Node Cleanup Protocol..."

# 1. Create the Legacy Vault
mkdir -p _legacy_backup

# 2. Identify and Relocate MVC Conflicts
TARGETS=("controllers" "models" "routes")

for TARGET in "${TARGETS[@]}"; do
    if [ -d "$TARGET" ]; then
        echo "📦 Relocating legacy $TARGET to vault..."
        mv "$TARGET" "_legacy_backup/"
    else
        echo "ℹ️  Legacy $TARGET already cleared or not present."
    fi
done

# 3. Clean deprecated utility nodes
if [ -f "utils/pluginLoader.ts" ]; then
    echo "📦 Vaulting deprecated pluginLoader..."
    mv "utils/pluginLoader.ts" "_legacy_backup/"
fi

echo "✅ Purification Complete. System is now Plugin-Exclusive."
