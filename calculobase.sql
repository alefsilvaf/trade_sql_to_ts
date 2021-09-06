DECLARE @P FLOAT = 36, 
		@J FLOAT = 1.39 / 100, 
		@Entrada DATE = '2021-07-15',
		@VencimentoInicial DATE = '2021-08-20',
		@Goal MONEY = 45000

DECLARE @Vencimento DATE = @VencimentoInicial
DECLARE @D FLOAT = 1

DECLARE @Sum MONEY = 0
DECLARE @X FLOAT = (@Goal / @P) * (1 + @J)

WHILE @Sum < @Goal
BEGIN

	SET @X += 10
	SET @Sum = 0
	SET @D = 1
	SET @Vencimento = @VencimentoInicial

	WHILE @D <= @P 
	BEGIN	
		SET @Sum += @X - (@X * (@J / 30) * DATEDIFF(DAY, @Entrada, @Vencimento))
		SET @D += 1
		SET @Vencimento = DATEADD(MONTH, 1, @Vencimento)
	END
END

WHILE @Sum > @Goal
BEGIN

	SET @X -= 0.01
	SET @Sum = 0
	SET @D = 1
	SET @Vencimento = @VencimentoInicial

	WHILE @D <= @P 
	BEGIN	
		SET @Sum += @X - (@X * (@J / 30) * DATEDIFF(DAY, @Entrada, @Vencimento))
		SET @D += 1
		SET @Vencimento = DATEADD(MONTH, 1, @Vencimento)
	END
END

PRINT @X

