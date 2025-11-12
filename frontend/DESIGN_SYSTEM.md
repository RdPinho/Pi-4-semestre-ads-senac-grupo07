# Design System - Sistema de Barbearia

Este documento descreve o design system padronizado baseado no estilo do login.component, para garantir consistência visual em toda a aplicação.

## 🎨 Paleta de Cores

### Cores Principais
- **Primary**: `--primary-color: #ff6b35` (Laranja)
- **Primary Dark**: `--primary-dark: #e55a2e`
- **Secondary**: `--secondary-color: #f39c12` (Amarelo)
- **Secondary Dark**: `--secondary-dark: #e67e22`

### Cores de Fundo
- **Background Principal**: `--bg-primary: #141414` (Cinza escuro)
- **Background Secundário**: `--bg-secondary: #131414`
- **Background Cards**: `--bg-card: #000000` (Preto)
- **Background Inputs**: `--bg-input: #110101`

### Cores de Texto
- **Texto Principal**: `--text-primary: #ffffff` (Branco)
- **Texto Secundário**: `--text-secondary: #f7f7f7`
- **Texto Muted**: `--text-muted: #7f8c8d`

### Cores de Status
- **Sucesso**: `--success-color: #27ae60`
- **Erro**: `--error-color: #e74c3c`
- **Aviso**: `--warning-color: #f39c12`
- **Info**: `--info-color: #3498db`

## 📏 Espaçamentos

- `--spacing-xs: 8px`
- `--spacing-sm: 12px`
- `--spacing-md: 16px`
- `--spacing-lg: 24px`
- `--spacing-xl: 32px`
- `--spacing-2xl: 40px`
- `--spacing-3xl: 64px`

## 🖋️ Tipografia

### Tamanhos de Fonte
- `--font-size-xs: 12px`
- `--font-size-sm: 14px`
- `--font-size-base: 16px`
- `--font-size-lg: 18px`
- `--font-size-xl: 24px`
- `--font-size-2xl: 28px`
- `--font-size-3xl: 36px`
- `--font-size-4xl: 48px`

### Pesos de Fonte
- `--font-weight-light: 300`
- `--font-weight-normal: 400`
- `--font-weight-medium: 500`
- `--font-weight-semibold: 600`
- `--font-weight-bold: 700`

## 🔘 Componentes Reutilizáveis

### Layout de Página
```html
<div class="page-layout">
  <!-- Background decorativo opcional -->
  <div class="background-decoration">
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>
    <div class="shape shape-3"></div>
  </div>
  
  <div class="page-content">
    <!-- Conteúdo da página -->
  </div>
</div>
```

### Seção da Marca
```html
<div class="brand-section">
  <div class="brand-logo">
    <mat-icon>content_cut</mat-icon>
  </div>
  <h1 class="brand-title">BARBER7</h1>
  <p class="brand-subtitle">Sistema de Gerenciamento</p>
</div>
```

### Card de Formulário
```html
<div class="form-card">
  <div class="form-header">
    <h2 class="form-title">Título do Formulário</h2>
    <p class="form-subtitle">Subtítulo opcional</p>
  </div>
  <!-- Conteúdo do formulário -->
</div>
```

### Campos de Entrada
```html
<div class="form-group">
  <label class="form-label">Label</label>
  <div class="input-wrapper">
    <input type="text" class="form-input" placeholder="Placeholder">
    <!-- Botão toggle opcional -->
    <button type="button" class="toggle-btn">
      <mat-icon>visibility</mat-icon>
    </button>
  </div>
  <div class="error-text" *ngIf="hasError">Mensagem de erro</div>
</div>
```

### Botões
```html
<!-- Botão principal -->
<button class="btn">Texto do Botão</button>

<!-- Variações -->
<button class="btn btn-secondary">Secundário</button>
<button class="btn btn-outline">Outline</button>
<button class="btn btn-lg">Grande</button>
<button class="btn btn-sm">Pequeno</button>
```

### Cards de Estatísticas
```html
<div class="stats-grid">
  <div class="stat-card stat-primary">
    <div class="stat-icon">
      <mat-icon>today</mat-icon>
    </div>
    <div class="stat-content">
      <h3>25</h3>
      <p>Agendamentos Hoje</p>
    </div>
  </div>
</div>
```

### Cards de Ação
```html
<div class="actions-grid">
  <div class="action-card" (click)="action()">
    <div class="action-icon">
      <mat-icon>person_add</mat-icon>
    </div>
    <h4>Novo Cliente</h4>
    <p>Cadastrar um novo cliente no sistema</p>
  </div>
</div>
```

### Header da Aplicação
```html
<header class="app-header">
  <div class="header-content">
    <div class="header-brand">
      <div class="header-logo">
        <mat-icon>content_cut</mat-icon>
      </div>
      <h1 class="header-title">BARBER7</h1>
    </div>
    
    <div class="user-section">
      <div class="user-info">
        <div class="user-avatar">
          <mat-icon>person</mat-icon>
        </div>
        <div class="user-details">
          <span class="user-name">Nome do Usuário</span>
          <span class="user-role">Administrador</span>
        </div>
      </div>
      <button class="btn btn-sm" (click)="logout()">
        <mat-icon>logout</mat-icon>
        Sair
      </button>
    </div>
  </div>
</header>
```

## 🎭 Estados e Variações

### Cores de Status para Cards
- `.stat-primary` - Cor principal (laranja)
- `.stat-success` - Verde para sucesso
- `.stat-warning` - Amarelo para avisos
- `.stat-info` - Azul para informações

### Estados de Mensagem
- `.message.error` - Mensagem de erro
- `.message.success` - Mensagem de sucesso
- `.message.warning` - Mensagem de aviso
- `.message.info` - Mensagem informativa

### Classes Utilitárias

#### Layout
- `.d-flex`, `.d-block`, `.d-none`
- `.flex-column`, `.flex-row`
- `.justify-content-center`, `.justify-content-between`
- `.align-items-center`, `.align-items-start`
- `.w-100`, `.h-100`

#### Espaçamentos
- `.m-0` até `.m-5` (margem)
- `.p-0` até `.p-5` (padding)
- `.mb-0` até `.mb-5` (margin-bottom)
- `.mt-0` até `.mt-5` (margin-top)

#### Texto
- `.text-primary`, `.text-secondary`, `.text-muted`
- `.text-center`, `.text-left`, `.text-right`
- `.title-xl`, `.title-lg`, `.subtitle`

#### Animações
- `.fade-in` - Animação de entrada
- `.slide-in-left`, `.slide-in-right` - Deslizar
- `.hover-lift` - Efeito hover

## 📱 Responsividade

O design system inclui breakpoints automáticos:
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

### Uso Recomendado

1. **Sempre use as variáveis CSS** ao invés de valores hardcoded
2. **Combine classes utilitárias** para layouts rápidos
3. **Use os componentes base** como ponto de partida
4. **Mantenha consistência** nos espaçamentos e cores
5. **Teste em diferentes dispositivos** para garantir responsividade

### Exemplo de Componente Completo

```typescript
// component.ts
@Component({
  selector: 'app-example',
  template: `
    <div class="page-layout">
      <div class="background-decoration">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
      </div>
      
      <div class="page-content">
        <div class="form-card">
          <div class="form-header">
            <h2 class="form-title">Exemplo</h2>
          </div>
          
          <div class="stats-grid mb-4">
            <div class="stat-card stat-primary">
              <div class="stat-icon">
                <mat-icon>analytics</mat-icon>
              </div>
              <div class="stat-content">
                <h3>100</h3>
                <p>Total</p>
              </div>
            </div>
          </div>
          
          <button class="btn w-100">
            Ação Principal
          </button>
        </div>
      </div>
    </div>
  `
})
```

Este design system garante que todos os componentes tenham aparência e comportamento consistentes, seguindo o padrão visual estabelecido no login.