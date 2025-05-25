// 测试流量解析功能
const parseRemainingTrafficFromYaml = (yamlContent) => {
  try {
    // 使用更灵活的正则表达式来匹配剩余流量信息
    const patterns = [
      /剩余流量[：:]\s*(\d+\.?\d*)\s*GB/gi,
      /剩余流量[：:]\s*(\d+\.?\d*)\s*gb/gi,
      /remaining.*?(\d+\.?\d*)\s*GB/gi,
      /traffic.*?(\d+\.?\d*)\s*GB/gi
    ];
    
    for (const pattern of patterns) {
      // 使用exec替代matchAll以兼容Node.js
      pattern.lastIndex = 0; // 重置正则表达式索引
      const match = pattern.exec(yamlContent);
      if (match && match[1]) {
        const traffic = parseFloat(match[1]);
        if (!isNaN(traffic) && traffic > 0) {
          console.log(`找到剩余流量信息: ${traffic} GB`);
          return traffic;
        }
      }
    }
    
    console.warn('未找到剩余流量信息');
    return null;
  } catch (error) {
    console.error('解析剩余流量失败:', error);
    return null;
  }
};

// 测试用例1：原始格式
const testYaml1 = `
proxies:
  - {name: 🏳️‍🌈 剩余流量：73.48 GB, server: south-pacific-a.blob1-nio.com, port: 31141, type: ss}
  - {name: 距离下次重置剩余：8 天, server: south-pacific-a.blob1-nio.com, port: 31141, type: ss}
`;

// 测试用例2：新格式
const testYaml2 = `
mixed-port: 7890
proxies:
    - { name: '剩余流量：228.6 GB', type: trojan, server: hky.cloud-services.top, port: 443 }
    - { name: 套餐到期：长期有效, type: trojan, server: hky.cloud-services.top, port: 443 }
`;

// 测试用例3：另一种格式
const testYaml3 = `
proxies:
    - { name: '剩余流量：160.09 GB', type: trojan, server: ss.hkglink.xyz, port: 10101 }
    - { name: '距离下次重置剩余：27 天', type: trojan, server: ss.hkglink.xyz, port: 10101 }
`;

console.log('=== 测试流量解析功能 ===');
console.log('测试用例1:', parseRemainingTrafficFromYaml(testYaml1));
console.log('测试用例2:', parseRemainingTrafficFromYaml(testYaml2));
console.log('测试用例3:', parseRemainingTrafficFromYaml(testYaml3));
