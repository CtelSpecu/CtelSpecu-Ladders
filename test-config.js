// 测试配置文件 - 验证URL分配是否正确
import * as yaml from 'js-yaml';
import { readFileSync } from 'fs';

try {
  // 读取YAML配置文件
  const yamlContent = readFileSync('./public/subscriptions.yaml', 'utf8');
  const config = yaml.load(yamlContent);
  
  console.log('=== 订阅配置验证 ===');
  
  config.subscriptions.forEach((sub, index) => {
    console.log(`\n订阅 ${index + 1}: ${sub.name}`);
    console.log(`  URL (用于复制/导入): ${sub.url}`);
    console.log(`  YAML URL (用于流量获取): ${sub.yamlUrl}`);
    
    // 验证URL用途
    const isUrlForDisplay = sub.url.startsWith('https://api.wcc.best/');
    const isYamlUrlForDisplay = sub.yamlUrl.startsWith('https://api.wcc.best/');
    
    console.log(`  URL是展示URL: ${isUrlForDisplay ? '❌ 错误' : '✅ 正确'}`);
    console.log(`  YAML URL是展示URL: ${isYamlUrlForDisplay ? '✅ 正确' : '❌ 错误'}`);
    
    if (isUrlForDisplay || !isYamlUrlForDisplay) {
      console.log(`  ⚠️  配置可能有问题`);
    } else {
      console.log(`  ✅ 配置正确`);
    }
  });
  
} catch (error) {
  console.error('读取配置文件失败:', error);
}
