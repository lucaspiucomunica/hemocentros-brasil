# 🧪 Comandos para Testar Geolocalização

## Como Usar

1. Abra o site no navegador
2. Abra o Console do Desenvolvedor (F12 → Console)
3. Cole um dos comandos abaixo
4. Clique no botão "Próximo a mim"

---

## 📍 Localizações de Teste

### 1️⃣ Simular localização em lugar MUITO REMOTO
**Localização:** Fernando de Noronha - PE (ilha muito distante dos hemocentros)
```javascript
// Sobrescreve a API de geolocalização
navigator.geolocation.getCurrentPosition = function(success) {
  success({
    coords: {
      latitude: -3.8549,
      longitude: -32.4231,
      accuracy: 100
    },
    timestamp: Date.now()
  });
};
console.log('📍 Localização simulada: Fernando de Noronha - PE (muito distante!)');
```

### 2️⃣ Simular localização em MANAUS - AM
**Localização:** Manaus (longe da maioria dos hemocentros do sul/sudeste)
```javascript
navigator.geolocation.getCurrentPosition = function(success) {
  success({
    coords: {
      latitude: -3.1190,
      longitude: -60.0217,
      accuracy: 100
    },
    timestamp: Date.now()
  });
};
console.log('📍 Localização simulada: Manaus - AM');
```

### 3️⃣ Simular localização em SÃO PAULO - SP
**Localização:** São Paulo (muitos hemocentros próximos)
```javascript
navigator.geolocation.getCurrentPosition = function(success) {
  success({
    coords: {
      latitude: -23.5505,
      longitude: -46.6333,
      accuracy: 100
    },
    timestamp: Date.now()
  });
};
console.log('📍 Localização simulada: São Paulo - SP');
```

### 4️⃣ Simular localização em BRASÍLIA - DF
**Localização:** Brasília (região centro-oeste)
```javascript
navigator.geolocation.getCurrentPosition = function(success) {
  success({
    coords: {
      latitude: -15.7975,
      longitude: -47.8919,
      accuracy: 100
    },
    timestamp: Date.now()
  });
};
console.log('📍 Localização simulada: Brasília - DF');
```

### 5️⃣ Simular localização no MEIO DO OCEANO 🌊
**Localização:** Meio do Atlântico (garantido de estar > 500km!)
```javascript
navigator.geolocation.getCurrentPosition = function(success) {
  success({
    coords: {
      latitude: -10.0000,
      longitude: -30.0000,
      accuracy: 100
    },
    timestamp: Date.now()
  });
};
console.log('📍 Localização simulada: Meio do Oceano Atlântico! 🌊');
```

---

## 🔄 Resetar para Localização Real

Use este comando para voltar a usar sua localização real:

```javascript
// Recarrega a página para restaurar a API original
location.reload();
```

Ou simplesmente **recarregue a página** (F5).

---

## 💡 Dicas

- **Após colar o comando**, clique em "Próximo a mim" para ativar a busca
- **Para testar diferentes localizações**, cole outro comando e clique em "Próximo a mim" novamente
- **Console aberto**: Você verá mensagens confirmando qual localização foi simulada
- **Distâncias**: O oceano e Fernando de Noronha garantem que você teste o dialog de 500km

---

## 🎯 Testes Recomendados

### Teste 1: Muitos hemocentros próximos
1. Use o comando de **São Paulo**
2. Clique em "Próximo a mim"
3. Deve mostrar vários hemocentros dentro de 500km com paginação

### Teste 2: Dialog de limite (> 500km)
1. Use o comando do **Oceano Atlântico**
2. Clique em "Próximo a mim"
3. Deve aparecer o dialog perguntando se quer ver além de 500km
4. Teste ambas as opções: "Não, obrigado" e "Sim, mostrar o mais próximo"

### Teste 3: Poucos hemocentros próximos
1. Use o comando de **Fernando de Noronha** ou **Manaus**
2. Clique em "Próximo a mim"
3. Observe se há hemocentros dentro do raio

---

## 🐛 Troubleshooting

**O comando não funcionou?**
- Certifique-se de colar o comando ANTES de clicar em "Próximo a mim"
- Verifique se não há erros no console
- Recarregue a página e tente novamente

**Quer voltar ao normal?**
- Simplesmente recarregue a página (F5 ou Ctrl+R)
